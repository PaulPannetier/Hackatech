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
    static MesuringString(spritebatch, string, font)
    { 
        let tmp = spritebatch.font;
        spritebatch.font = font;   

        let metrics = spritebatch.measureText(string);
        //let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        spritebatch.font = tmp;
        return new Vector2(metrics.width, actualHeight);
    }
    
    static Rand(a, b)
    {
        return  Math.floor(Math.abs((b - a) + 1) * Math.random() + Math.min(a, b));
    }

    static Contain(pos, size, point)
    {
        return point.x >= pos.x && point.x <= pos.x + size.x && point.y >= pos.y && point.y <= pos.y + size.y;
    }

    static Lerp(a, b, t)
    {
        return (b - a) * t + a;
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

//import React from "react";
import * as W3 from "./node_modules/@massalabs/massa-web3";
//import { App } from "./web3Client";
//const func = require("./web3Client");

const canvas = document.getElementById('canvas');//on recup le canvas
const spritebatch = canvas.getContext("2d");
let dt;
let mousePos = new Vector2(0, 0);

const blockChainAdress = "A1MNwcvtsBYqZqqzvhDdWcG5Z6dNKhw5Gvp2AQpWR1uqd4v3L9K";
const blockImageOffset = new Vector2(10, 10);
const blockImageSizeOnCanvas = new Vector2(900 , 900);
const infoOffsetX = 15;
const infoHeightPercentage = 0.5;
const validateButtonSize = new Vector2(250, 100);
const validateButtonColorHover = new Color(210, 210, 210);
const validateButtonColor = new Color(170, 170, 170);
const infoFontColor = new Color(255, 255, 255);
const colorPaletteItemGap = new Vector2(25, 20);
const paintingColours = [
    new Color(255, 255, 255), new Color(0, 0, 0), new Color(255, 242, 5),
    new Color(128, 255, 0), new Color(255, 0, 255), new Color(128, 0, 255),
    new Color(255, 0, 0), new Color(14, 77, 241), new Color(127, 127, 127),
    new Color(0, 255, 255), new Color(255, 118, 0), new Color(207, 48, 52),
    new Color(0, 128, 0), new Color(128, 64, 64), new Color(200, 200, 200),
    new Color(154, 85, 200)
];
const paintingColoursSize = new Vector2(4, 4);
const minPixelprice = 0.05, maxPixelPrice = 1.5;

let infoFontSize = 30;
let oldDate, newDate;
let blockChainImage;
let blockChainImageSize = new Vector2(16, 16);
let selectedColor;
let bgColor = new Color(49, 82, 184);
let onMouseClick = false, isMouseDown = false;
let gridColor = new Color(100, 100, 100);
let lineThinckness = 1;
let nbPixelBuy;
let userId = 85475;

const emptyImage = new Image();
emptyImage.src = "./Asset/empty.png";
const web3Client = new W3.Web3Client();

function Start()
{
    oldDate = new Date();
    blockChainImage = new BlockChainImage(blockChainImageSize.x, blockChainImageSize.y);
    LoadBlockChainImage();
    selectedColor = new Color(255, 0, 0);
    nbPixelBuy = 0;
    selectedColor = paintingColours[0];

    Render();
}

function LoadBlockChainImage()
{

}

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

    DrawColorPalette();
    
    spritebatch.font = "50px serif";
    spritebatch.fillStyle = "rgb(0, 0, 0)";
    spritebatch.fillText(mess, 100, 100);

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
                spritebatch.fillRect(x * step.x + blockImageOffset.x, y * step.y + blockImageOffset.y, step.x + 1, step.y + 1);
            }
        }
    }
}

function DrawRightInfo()
{
    spritebatch.lineWidth = (lineThinckness * 4).toString();
    spritebatch.strokeStyle = gridColor.ToString();
    let recSize = new Vector2(canvas.width - blockImageSizeOnCanvas.x - 3 * blockImageOffset.x, blockImageSizeOnCanvas.y)
    spritebatch.strokeRect(blockImageSizeOnCanvas.x + 2 * blockImageOffset.x + 100, blockImageOffset.y, recSize.x - 100, recSize.y);

    spritebatch.strokeRect(blockImageSizeOnCanvas.x + 2 * blockImageOffset.x + 10 + 100, blockImageOffset.y + 10,
        recSize.x - 20 - 100, recSize.y * infoHeightPercentage);

    let infoNbPixels = "Nombre de pixels : " + nbPixelBuy.toString();
    let infoCost = "Coût total : " + EvaluateCost().toString();
    let infoOwnPercentage = "Pourcentage d'acquisition : " + EvaluateOwningPercentage().toString() + "%";
    let infos = [infoNbPixels, infoCost, infoOwnPercentage];

    let ttSizeY = 0;
    for (let i = 0; i < infos.length; i++) 
    {
        let size = Useful.MesuringString(spritebatch, infos[i],  infoFontSize.toString() + "px serif");
        ttSizeY += size.y;
    }

    let yStep = (blockImageSizeOnCanvas.y * infoHeightPercentage - validateButtonSize.y) / (infos.length + 1);
    for (let i = 0; i < infos.length; i++) 
    {
        let x = blockImageSizeOnCanvas.x + 2 * blockImageOffset.x + infoOffsetX;
        let y = yStep * (i + 1);
        spritebatch.font = infoFontSize.toString() + "px serif";
        spritebatch.fillStyle = infoFontColor.ToString();
        spritebatch.fillText(infos[i], x + 100, y);
    }

    //le bouton validé
    let tmpSize = canvas.width - blockImageSizeOnCanvas.x - 2 * blockImageOffset.x;
    let x = blockImageSizeOnCanvas.x + 2 * blockImageOffset.x + ((tmpSize - validateButtonSize.x)/2);
    let y = infoHeightPercentage * blockImageSizeOnCanvas.y - validateButtonSize.y;

    let containMouse = Useful.Contain(new Vector2(x + 100, y), validateButtonSize, mousePos);
    let textColor;
    if(containMouse)
    {
        spritebatch.fillStyle = validateButtonColorHover.ToString();
        textColor = validateButtonColor;
    }  
    else
    {
        spritebatch.fillStyle = validateButtonColor.ToString();
        textColor = validateButtonColorHover;
    }  
    spritebatch.fillRect(x + 100, y, validateButtonSize.x, validateButtonSize.y);

    spritebatch.font = (infoFontSize * 1.2).toString() + "px serif";
    spritebatch.fillStyle = textColor.ToString();
    let textSize = Useful.MesuringString(spritebatch, "Validé", spritebatch.font);

    spritebatch.fillText("Validé", x + 100 + (validateButtonSize.x - textSize.x) * 0.5, y + ((validateButtonSize.y + textSize.y) * 0.5));

    if(containMouse && onMouseClick)
    {        
        BuyAllPixels();
    }
}

function DrawColorPalette()
{
    const x = 3 * blockImageOffset.x + blockImageSizeOnCanvas.x;
    const y = 10 + 2 * blockImageOffset.y + infoHeightPercentage * blockImageSizeOnCanvas.y;
    let posTopRight = new Vector2(x, y);
    let sizeX = canvas.width - blockImageSizeOnCanvas.x - 5 * blockImageOffset.x - 100;
    let sizeY = blockImageSizeOnCanvas.y - 3 * blockImageOffset.y - infoHeightPercentage * blockImageSizeOnCanvas.y;
    let ttSize = new Vector2(sizeX, sizeY);

    spritebatch.lineWidth = (lineThinckness * 4).toString();
    spritebatch.strokeStyle = gridColor.ToString();
    spritebatch.strokeRect(x + 100, y, sizeX, sizeY);

    let itemSizeX = (ttSize.x - (2 * blockImageOffset.x) - (colorPaletteItemGap.x * (paintingColoursSize.x + 1))) /paintingColoursSize.x;
    let itemSizeY = (ttSize.y - (2 * blockImageOffset.y) - (colorPaletteItemGap.y * (paintingColoursSize.y + 1))) /paintingColoursSize.y; 

    for(let i = 0; i < paintingColoursSize.x; i++)
    {
        for(let j = 0; j < paintingColoursSize.y; j++)
        {
            let tmpX = x + colorPaletteItemGap.x + i * (colorPaletteItemGap.x + itemSizeX);
            let tmpY = y + colorPaletteItemGap.y + j * (colorPaletteItemGap.y + itemSizeY);
            spritebatch.strokeRect(tmpX + 100, tmpY, itemSizeX, itemSizeY);

            let colorItem = paintingColours[i * paintingColoursSize.x + j];
            spritebatch.fillStyle = colorItem.ToString();
            spritebatch.fillRect(tmpX + 2 + 100, tmpY + 2, itemSizeX - 4, itemSizeY - 4);

            if(onMouseClick && Useful.Contain(new Vector2(tmpX + 2 + 100, tmpY + 2), new Vector2(itemSizeX - 4, itemSizeY - 4), mousePos))
            {
                selectedColor = colorItem;
            }
        }
    }
}

function EvaluateCost()
{
    let pixelFull = 0, pixelEmpty = 0;

    for(let x = 0; x < blockChainImageSize.x; x++)
    {
        for(let y = 0; y < blockChainImageSize.y; y++)
        {
            if(blockChainImage != null && blockChainImage != undefined && blockChainImage.pixels[x][y]!= null)
            {
                pixelFull++;
            }
            else
            {
                pixelEmpty++;
            }
        }
    }

    pixelFull -= nbPixelBuy;
    pixelEmpty += nbPixelBuy;
    let cost = 0;

    for(let i = 0; i < nbPixelBuy; i++)
    {
        cost += Useful.Lerp(minPixelprice, maxPixelPrice, pixelFull / (pixelEmpty + pixelFull));
        pixelFull++;
        pixelEmpty--;
    }

    return Math.round(cost * 100.0) / 100.0;
}

function EvaluateOwningPercentage()
{
    return Math.round(10000.0 * nbPixelBuy / (blockChainImageSize.x * blockChainImageSize.y)) / 100.0;
}

function BuyAllPixels()
{
    for(let x = 0; x < blockChainImageSize.x; x++)
    {
        for(let y = 0; y < blockChainImageSize.y; y++)
        {
            if(blockChainImage != null && blockChainImage != undefined && blockChainImage.pixels[x][y] != null)
            {
                HandleSubmit(x, y, blockChainImage.pixels[x][y]);
            }
        }
    }
}

let mess;

async function HandleSubmit(x, y, color)
{
    let message = x.toString() + "," + y.toString() + "," + color.R.toString() + "," + color.G.toString() + "," + color.B.toString();
    const data = await W3.web3Client.smartContracts().callSmartContract({
        fee: 0,
        gasPrice: 0,
        maxGas: 2000000,
        coins: 0,
        targetAddress: blockChainAdress,
        functionName: "setColor",
        parameter: message,
    });
    mess = data;
}

function Keypressed(keynumber)
{
    return;
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
