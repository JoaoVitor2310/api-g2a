
// attPrices
if (response2.data.menorPreco > 0) {
    try {
        const response3 = await axios.get(`${nossaURL}/api/offers/returnOfferId/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        }); // Recebe um objeto com o id do jogo, e o menor preço que pode ser: o preço mesmo, -1 para jogos impossíveis e -2 para jogos sem concorrentes
        if (response3.data > 0) {
            console.log(`Id da oferta: ${response3.data}`);
            const offerId = response3.data;

            try {
                const response4 = await axios.get(`${nossaURL}/api/offers/offerKeys/${offerId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                let keys = response4.data;

                for (let key of keys) {
                    // let key = "CB0WV-IPMNP-GFKHC";

                    if (key.includes('/')) {
                        key = key.replace('/', 'barra');
                    }
                    // if (key.startsWith("https") || // Keys que são links(steam, gog, etc)
                    //  key == "Z6LCN-84FCF-7M393" || // Key está na planilha, mas não possui o Valor Pago
                    //  key == "66LBE-PIPR3-E2IG5 / 5JWA4-VPMTY-C5JM6 / 7F6FM-2VJ02-2Z0XI / 6ZEQG-IY990-82PHD / 6BL7F-PITBV-8F47C / 78DDZ-T20TQ-VLV4Q / 78F4G-CZ7E3-67GJT / 6CMK9-TIA4K-GDKMB / 6GFZQ-FRRR6-ZA6MQ / 620IE-NEJGV-JGG80" ||
                    //  key == "Demetrios The BIG Cynical Adventure - Base Game: K5QB5-PM2G2-KFER6 / Original Soundtrack DLC: YCGXM-NINMD-JIB3B / Artbook DLC: 7EE9T-CKK5K-DYN4A" ||
                    //  key == "QG6PT-KCNNL-2BA0Y / P4C6Z-RK47A-0IYQG" ||
                    //  key == "QFHQ7-NCP2A-0MQGZ / P9TY6-XN2IB-D00RI" ||
                    //  key == "YYNC8-DEEG3-6FKXD / LI4XV-EM0RL-HTMF6" ||
                    //  key == "0B57B-L7TXC-H3TZD / 0CRNQ-G5990-C9ETT / 0IL6R-B99JK-6X52W" ||
                    //  key == "7N4CW-EFHVY-W6XBA / 6V87L-23V96-J8DEC / 6IVXK-PA8H8-2FPIV" ||
                    //  key == "9HGH6-JGLCN-7BWFT / 9EFRH-KPF2T-RKZK5 / 9HZKQ-8GAAT-D3R8E" ||
                    //  key == "AHGW5-ACA5R-DGC5I / 9P7PH-869CZ-X7N8L / 9DJM4-47W3L-KYLMI" ||
                    //  key == "9HAK2-HWCDB-ZDY9K / 98RDB-669PK-36PXI / 9W3ZJ-WQMBL-97K6F" ||
                    //  key == "6KPYQ-Z5N8Q-JVQKM Worms Rumble / 4XLEN-9WF3N-FP2DY Legends Pack DLC Global / 3KNZ7-I3HVN-H07N8 New Challengers Pack DLC Global" ||
                    //  key == "6QB2J-MK6GW-TZM2B Worms Rumble / 4P3T5-2ABN3-DQ7G5 Legends Pack DLC Global / 467CD-GZJI0-FKWQP New Challengers Pack DLC Global" ||
                    //  key == "6TVVT-2CFLQ-MTDHR Worms Rumble / 3CQR6-EIRTX-RYVHT Legends Pack DLC Global / 3NQ0R-V3G9W-8Z2TY New Challengers Pack DLC Global" ||
                    //  key == "6VIQT-2WRR9-W6AHV Worms Rumble / 4LMBY-L4BCL-MWH54 Legends Pack DLC Global / 3ZGWE-Y2EY8-IHTLB New Challengers Pack DLC Global" ||
                    //  key == "7094A-F9BBA-CBXK2 Worms Rumble / 4YM79-FA0LY-PQ7NL Legends Pack DLC Global / 3A9A6-DYPCH-T2NBV New Challengers Pack DLC Global" ||
                    //  key == "72R9N-CWVR3-A2NCF Worms Rumble / 0RTA6-CDGNE-3XRQF Legends Pack DLC Global / 3IGYX-Y8H7P-RDHZ0 New Challengers Pack DLC Global" ||
                    //  key == "76A90-9N822-J35P9 Worms Rumble / 4VIQV-3PEBD-7PY5Q Legends Pack DLC Global / 3MCBQ-LHDT9-T6JP7 New Challengers Pack DLC Global" ||
                    //  key == "77NPI-JKRG3-3BWEH Worms Rumble / 4M7G6-T8WT8-DB30M Legends Pack DLC Global / 3J9WW-A0LTI-J27A6 New Challengers Pack DLC Global" ||
                    //  key == "7DQDK-DEQQ7-YQCXD Worms Rumble / 52K58-FEWQJ-APT2N Legends Pack DLC Global / 3MPK4-3J9AR-EV9MD New Challengers Pack DLC Global" ||
                    //  key == "7NQPF-KWG34-C29J4 Worms Rumble / 55X5H-TYMVE-M5IHI Legends Pack DLC Global / 3J723-JNRZW-PDN4D New Challengers Pack DLC Global" ||
                    //  key == "N9XDA-4NELN-LZM45/JYHKN-8QM2I-56ZGI/A79RT-JGLY6-QQRMX/7X2K8-K3VQJ-J2G3Y") {
                    //     console.log(`Dados da key: Chave não encontrada na planilha`);
                    // }

                    if (key.includes("/") || key == "Z6LCN-84FCF-7M393") { // Chave sem o valor pago
                        console.log(`Dados da key: Chave não encontrada na planilha`);

                    }
                    else if (key.startsWith("https")) {
                        keysWithHttps.push(key);
                        console.log(`keysWithHttps++`);
                    }
                    else {
                        const response5 = await axios.get(`${nossaURL}/api/sheets/dataKeysAnalyse/${key}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                        });
                        const keyData = response5.data;
                        if (keyData.error) {
                            console.log(`Erro: ${keyData.error}`);
                        } else {
                            keysInXLSX.push(key);
                            console.log(`keysInXLSX++`);
                            // EditOffer
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Erro ao consultar a nossa API /offerKeys.' });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao consultar a nossa API /returnOfferId.' });
    }
}

[
    {
        "productId": "10000503634001",
        "offerId": "0e1e4a81-4061-4df2-a659-964d704cbfa2",
        "offerType": "game",
        "offerSize": 1
    },
    {
        "productId": "10000264797001",
        "offerId": "46f1876e-887f-4ea3-a529-be37865e611d",
        "offerType": "game",
        "offerSize": 10
    },
    {
        "productId": "10000219610001",
        "offerId": "e2a2e103-36f3-4e76-84ab-6051d77a0fa1",
        "offerType": "game",
        "offerSize": 2
    },
    {
        "productId": "10000035895002",
        "offerId": "25851f22-759e-4570-9305-dd7c93e51b0f",
        "offerType": "game",
        "offerSize": 10
    },
    {
        "productId": "10000195492001",
        "offerId": "0dab28d2-eb76-409e-8bd3-246202b2df2b",
        "offerType": "game",
        "offerSize": 1
    },
]

{
    "id": "630de4e0-a837-48d9-a7f3-47395d550156",
        "type": "game",
            "createdAt": "2023-08-15T01:33:35Z",
                "updatedAt": "2023-08-15T01:33:35Z",
                    "expireAt": "2043-08-15T01:33:35Z",
                        "price": "1.30",
                            "businessPrice": "1.69",
                                "visibility": "all",
                                    "status": "active",
                                        "inventory": {
        "size": 1,
            "sold": 0,
                "type": ""
    },
    "product": {
        "id": "10000001762003",
            "name": "Antisquad Steam Key GLOBAL",
                "sku": ""
    }
}



1 -
{
    productId: '10000190405001',
    menorPreco: '2.80',
    offerId: '1b8ad65b-6350-4a26-b739-fc260fd99659',
    offerType: 'game',
    offerSize: 1,
    gameName: 'Death Crown Steam Key GLOBAL'
}

2 - {
    productId: "10000178835001",
    menorPreco: -4,
    offerId: "e087dd86-0ab3-4ff1-ba7b-d0188e5254b0",
    offerType: 'game',
    offerSize: 1,
    gameName: "Retro Sphere Steam Key GLOBAL"
}
3 -
{
    productId: '10000001090003',
    menorPreco: '3.02',
    offerId: '7192bbbf-0e92-4b06-b799-90e72e1f0da7',
    offerType: 'game',
    offerSize: 10,
    gameName: 'Kung Fury: Street Rage Steam Key GLOBAL'
}
4-
{
    productId: '10000500096002',
    menorPreco: '3.90',
    offerId: '65995352-fa42-4091-9096-f1c1f38fe85c',
    offerType: 'game',
    offerSize: 2,
    gameName: 'DC League of Super-Pets: The Adventures of Krypto and Ace (PC) - Steam Key - GLOBAL'
  }

5 -
{
    productId: '10000176345001',
    menorPreco: '9.28',
    offerId: 'a0445116-c5cd-4596-9aff-64156b891409',
    offerType: 'game',
    offerSize: 1,
    gameName: 'Mercury Race Steam Key GLOBAL'
}

6 -
{
    productId: '10000004599002',
    menorPreco: '2.11',
    offerId: '0f2d5521-efce-4f10-a0ec-2b9bba6ba7da',
    offerType: 'game',
    offerSize: 10,
    gameName: 'ROOT Steam Key GLOBAL'
}

7 -
{
    productId: '10000325279003',
    menorPreco: -4,
    offerId: 'ea91c7c5-7420-4d69-b7af-bb1d34bdc271',
    offerType: 'game',
    offerSize: 2,
    gameName: 'Midnight Ghost Hunt (PC) - Steam Key - EUROPE'
}


10000068272013 // Caso do jogo "out of stock"
cbce357b-9d89-4be6-813e-e2d8e7846f25
Black Desert Online (PC) - Black Desert Key - EUROPE


{ // Caso + de 3 candangos
    productId: '10000219610001',
    menorPreco: '1.37',
    offerId: 'e2a2e103-36f3-4e76-84ab-6051d77a0fa1',
    offerType: 'game',
    offerSize: 2,
    gameName: 'Stirring Abyss (PC) - Steam Key - GLOBAL'
  }

  {"productId":"10000008826005","offerId":"1f13eb03-05f2-451a-bff3-e11a20360a14","offerType":"game","offerSize":1,"gameName":"Wacky Wheels Steam Key GLOBAL"}