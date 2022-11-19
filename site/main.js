class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    Magnitude()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    SqrMagnitude()
    {
        return this.x * this.x + this.y * this.y;
    }

    Normalize()
    {
        mag = this.Magnitude();
        return new Vector2(x / mag, y / mag);
    }

    ToString()
    {
        return "(" + this.x.toString() + ", " + this.y.toString() + ")";
    }
}

class Useful
{
    static MesuringString(string, font)
    { 
        spritebatch.font = font;   
        let stringWidth = spritebatch.measureText(string).width;
        let stringHeight = spritebatch.measureText(string).height;
        return [stringWidth, stringHeight];
    }
    
    static Rand(a, b)
    {
        return  Math.floor(Math.abs((b - a) + 1) * Math.random() + Math.min(a, b));
    }
}

class Pixels
{
    constructor(name, color)
    {
        this.name = name;
        this.color = color;
    }
}

class Color
{
    constructor(R, G, B)
    {
        this.R = R;
        this.G = G;
        this.B = B;
    }

    ToString()
    {
        return "rgb(" + this.R.toString() +", " + this.G.toString() + ", " + this.B.toString() + ")";
    }
}

class BlockChainImage
{
    constructor(width, height)
    {
        this.pixels = [];
        this.width = width;
        this.height = height;
        for(let x = 0; x < this.width; x++)
        {
            this.pixels[x] = [];
            for(let y = 0; y < this.height; y++)
            {
                this.pixels[x][y] = null;
            }
        }
    }

    SetPixel(x, y, color)
    {
        if(x >= 0 && x < this.width && y >= 0 && y < this.height && this.pixels[x][y] == null)
        {
            this.pixels[x][y] = color;
        }
    }
}

const canvas = document.getElementById('canvas');//on recup le canvas
const spritebatch = canvas.getContext("2d");
let dt;
let mousePos = new Vector2(0, 0);

const blockImageOffset = new Vector2(10, 10);
const blockImageSizeOnCanvas = new Vector2(900, 900);

let infoFontSize = 30;
let oldDate, newDate;
let blockChainImage;
let blockChainImageSize = new Vector2(10, 10);
let selectedColor;
let bgColor = new Color(49, 82, 184);
let onMouseClick = false, isMouseDown = false;
let gridColor = new Color(100, 100, 100);
let lineThinckness = 1;
let nbPixelBuy;

const emptyImage = new Image();
emptyImage.src = "./Asset/empty.png";

function Start()
{
    oldDate = new Date();
    blockChainImage = new BlockChainImage(blockChainImageSize.x, blockChainImageSize.y);
    selectedColor = new Color(255, 0, 0);
    nbPixelBuy = 0;
    Render();
}

//la game loop
function Render()
{
    newDate = new Date();
    if(newDate.getMilliseconds() > oldDate.getMilliseconds())
    {
        dt = (newDate.getMilliseconds() - oldDate.getMilliseconds())/1000;
    }
    else
    {
        dt = (newDate.getMilliseconds() - (oldDate.getMilliseconds() - 1000))/1000;
    }

    Update()

    oldDate = newDate;
    window.requestAnimationFrame(Render);
}

function Update()
{
    spritebatch.fillStyle = bgColor.ToString();
    spritebatch.fillRect(0, 0, canvas.width, canvas.height);

    //draw le bg
    spritebatch.drawImage(emptyImage, 0, 0, emptyImage.width, emptyImage.height, blockImageOffset.x, blockImageOffset.y, blockImageSizeOnCanvas.x, blockImageSizeOnCanvas.y);
    HandleMouseClick();

    DrawMouseRectangle()

    DrawCurrentImage();

    DrawRightInfo();

    onMouseClick = false;
}

function HandleMouseClick()
{
    if(!isMouseDown)
    {
        return;
    }

    let step = new Vector2(blockImageSizeOnCanvas.x / blockChainImageSize.x, blockImageSizeOnCanvas.y / blockChainImageSize.y);
    let x = Math.floor((mousePos.x - blockImageOffset.x) / step.x);
    let y = Math.floor((mousePos.y - blockImageOffset.y) / step.y);
    if(x >= 0 && x < blockChainImageSize.x && y >= 0 && y < blockChainImageSize.y)
    {
        if(blockChainImage.pixels[x][y] == null)
        {
            blockChainImage.SetPixel(x, y, selectedColor);
            nbPixelBuy++;
        }
    }
}

function DrawMouseRectangle()
{
    if(mousePos.x < blockImageOffset.x || mousePos.x > blockImageOffset.x + blockImageSizeOnCanvas.x 
        || mousePos.y < blockImageOffset.y || mousePos.y > blockImageOffset.y + blockImageSizeOnCanvas.y)
    {
        return;
    }

    spritebatch.lineWidth = lineThinckness.toString();
    spritebatch.strokeStyle = gridColor.ToString();
    let step = new Vector2(blockImageSizeOnCanvas.x / blockChainImageSize.x, blockImageSizeOnCanvas.y / blockChainImageSize.y);
    let x = Math.floor((mousePos.x - blockImageOffset.x) / step.x);
    let y = Math.floor((mousePos.y - blockImageOffset.y) / step.y);
    spritebatch.strokeRect(x * step.x + blockImageOffset.x, y * step.y + blockImageOffset.y, step.x, step.y);
}

function DrawCurrentImage()
{
    let step = new Vector2(blockImageSizeOnCanvas.x / blockChainImageSize.x, blockImageSizeOnCanvas.y / blockChainImageSize.y);
    for(let x = 0; x < blockChainImageSize.x; x++)
    {
        for(let y = 0; y < blockChainImageSize.y; y++)
        {
            if(blockChainImage != null && blockChainImage != undefined && blockChainImage.pixels[x][y]!= null)
            {
                spritebatch.fillStyle = blockChainImage.pixels[x][y].ToString();
                spritebatch.fillRect(x * step.x + blockImageOffset.x, y * step.y + blockImageOffset.y, step.x, step.y);
            }
        }
    }
}

function DrawRightInfo()
{
    spritebatch.lineWidth = (lineThinckness * 4).toString();
    spritebatch.strokeStyle = gridColor.ToString();
    spritebatch.strokeRect(blockImageSizeOnCanvas.x + 2 * blockImageOffset.x, blockImageOffset.y,
        canvas.width - blockImageSizeOnCanvas.x - 3 * blockImageOffset.x, blockImageSizeOnCanvas.y);

    
}

function Keypressed(keynumber)
{
    switch(keynumber.code)
    {
        case "KeyW":
            break;
        case "Enter":
            break;
        default:
            break;
    }
}

function MouseClick(evt)
{
    SetMousePosition(canvas, evt);//actualise mousePos selon le repère d'origine (canvasX, canvasY) cad en haut a gauche du canvas
    onMouseClick = true;
}

function MouseDown(evt)
{
    SetMousePosition(canvas, evt);
    isMouseDown = true;
    console.log("Mousedown");
}

function MouseUp(evt)
{
    SetMousePosition(canvas, evt);
    isMouseDown = false;
}

function TriggerMosPosition(evt)
{
    SetMousePosition(canvas, evt);//actualise mousePos selon le repère d'origine (canvasX, canvasY) cad en haut a gauche du canvas
}

function SetMousePosition(el, event)
{
    //Calcule les coordonnées d'un événement par rapport à un élément(canvas)
    let ox = -el.offsetLeft,
        oy = -el.offsetTop;
    while (el = el.offsetParent) 
    {
        ox += el.scrollLeft - el.offsetLeft;
        oy += el.scrollTop - el.offsetTop;
    }
    mousePos = new Vector2(event.clientX + ox, event.clientY - canvas.getBoundingClientRect().y);
}

document.onkeypress = Keypressed;
document.addEventListener('click', MouseClick);
document.addEventListener('mouseup', MouseUp);
document.addEventListener('mousedown', MouseDown);
document.addEventListener('mousemove', TriggerMosPosition, false); 

emptyImage.onload = Start;//on demarre le jeu a la fin du chargement de l'image
