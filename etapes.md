## Compilation des sources
npm run build (main.ts -> wasm)
npm run deploy (envoie le wasm sur la blockchain)
npm run build:caller (caller.ts -> wasm)
npm run deploy build/caller.wasm (lance caller.wasm et permet de lancer des fonctions de la blockchain)


## Récupération des infos importantes : 
sed 's/Operation submitted successfully to the network. //' test.txt | 
        sed '/^$/d' | 
        sed -E '/^[>W]'/d | 
        sed -E '/^Deploying'/d | 
        sed 's/Deployment success with event: Contract deployed at address: //'

Address.fromByteString("A1rSj7GSGnHKH67UoHvoStMuM3i7JXFUecdeFkNRVAy1myXmgEL")

send_smart_contract C:\Users\alexandre\Desktop\projets perso\GottaGohack\Hackatech\massa-sc-example-sum\build\test.wasm 100000 0 0