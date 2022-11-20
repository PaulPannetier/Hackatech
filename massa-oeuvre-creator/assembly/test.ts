import { Address, Args, call } from "@massalabs/massa-as-sdk";

export function main(): void {
    // //tableau de l'oeuvre d'art
    // let poly_tab = new Array<Array<i32>>(10);
    // for(let i = 0; i < 10; i++){
    //     poly_tab[i] = new Array<i32>(10);
    // }

    //Ecriture du tableau ( fonctionnel)

    // //initialisation en blanc
    // for(let i = 0; i < 10; i++){
    //     for(let j = 0; j < 10; j++){
    //         poly_tab[i][j] = 0;
    //     }
    // }

    // //dessin du polylogo
    // poly_tab[2][4] = 1;
    // poly_tab[2][6] = 1;
    // poly_tab[2][7] = 1;
    // poly_tab[2][8] = 1;
    // poly_tab[2][9] = 1;
    // poly_tab[3][3] = 1;
    // poly_tab[3][7] = 1;
    // poly_tab[4][2] = 1;
    // poly_tab[4][8] = 1;
    // poly_tab[5][2] = 1;
    // poly_tab[5][8] = 1;
    // poly_tab[6][2] = 1;
    // poly_tab[6][8] = 1;
    // poly_tab[7][3] = 1;
    // poly_tab[7][7] = 1;
    // poly_tab[8][4] = 1;
    // poly_tab[8][5] = 1;
    // poly_tab[8][6] = 1;

    // for(let i = 0; i < 10; i++){
    //     for(let j = 0; j < 10; j++){
    //         if(poly_tab[i][j] == 1){
    //             call(Address.fromByteString("A1rSj7GSGnHKH67UoHvoStMuM3i7JXFUecdeFkNRVAy1myXmgEL"), "setColor", new Args().add(i as i32).add(j as i32).add(45 as i32).add(141 as i32).add(243 as i32), 0);
    //         }else{
    //             call(Address.fromByteString("A1rSj7GSGnHKH67UoHvoStMuM3i7JXFUecdeFkNRVAy1myXmgEL"), "setColor", new Args().add(i as i32).add(j as i32).add(255 as i32).add(255 as i32).add(255 as i32), 0);
    //         }
    //     }
    // }


    //Lecture du tableau
    let poly_tab2 = new Array<Array<String>>(10);
    for(let i = 0; i < 10; i++){
        poly_tab2[i] = new Array<String>(10);
    }

    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            poly_tab2[i][j] = call(Address.fromByteString("A1rSj7GSGnHKH67UoHvoStMuM3i7JXFUecdeFkNRVAy1myXmgEL"), "getColor", "1,1,255,255,255", 0);
        }
    }

}

