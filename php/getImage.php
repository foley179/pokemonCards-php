<?php

	// retrieving card details from pokemontcg
    $apiKey = "YOUR_API_HERE";
    $id = $_REQUEST["id"];

    $url = "https://api.pokemontcg.io/v2/cards/${id}";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "X-Api-Key: ${apiKey}"
    ));
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$output;

	$decode = json_decode($result,true);	

	try {
		if (property_exists($decode, "status")) {
			// error code is returned send error to js
			$output["status"]["code"] = "400";
			$output["status"]["name"] = "error";
			$output["status"]["description"] = "failure";
			$output["data"] = $decode;
		}
	} catch (\Throwable $th) {
		// if result is returned, find img url and return it

		$output["status"]["code"] = "200";
		$output["status"]["name"] = "ok";
		$output["status"]["description"] = "success";
		$output["data"] = $decode["data"]["images"];
	}

	$output["data"]["myOwn"] = $decode;
	
	header("Content-Type: application/json; charset=UTF-8");

	echo json_encode($output);

	/*
	returns:
	{
    "data": {
        "data": {
            "id": "pop4-13",
            "name": "Pikachu",
            "supertype": "Pok\u00e9mon",
            "subtypes": [
                "Basic"
            ],
            "hp": "50",
            "types": [
                "Lightning"
            ],
            "evolvesTo": [
                "Raichu"
            ],
            "attacks": [
                {
                    "name": "Spark",
                    "cost": [
                        "Lightning",
                        "Colorless"
                    ],
                    "convertedEnergyCost": 2,
                    "damage": "20",
                    "text": "Does 10 damage to 1 of your opponent's Benched Pok\u00e9mon. (Don't apply Weakness and Resistance for Benched Pok\u00e9mon.)"
                }
            ],
            "weaknesses": [
                {
                    "type": "Fighting",
                    "value": "\u00d72"
                }
            ],
            "retreatCost": [
                "Colorless"
            ],
            "convertedRetreatCost": 1,
            "set": {
                "id": "pop4",
                "name": "POP Series 4",
                "series": "POP",
                "printedTotal": 17,
                "total": 17,
                "legalities": {
                    "unlimited": "Legal"
                },
                "releaseDate": "2006\/08\/01",
                "updatedAt": "2020\/08\/14 09:35:00",
                "images": {
                    "symbol": "https:\/\/images.pokemontcg.io\/pop4\/symbol.png",
                    "logo": "https:\/\/images.pokemontcg.io\/pop4\/logo.png"
                }
            },
            "number": "13",
            "artist": "Kouki Saitou",
            "rarity": "Common",
            "nationalPokedexNumbers": [
                25
            ],
            "legalities": {
                "unlimited": "Legal"
            },
            "images": {
                "small": "https:\/\/images.pokemontcg.io\/pop4\/13.png",
                "large": "https:\/\/images.pokemontcg.io\/pop4\/13_hires.png"
            },
            "tcgplayer": {
                "url": "https:\/\/prices.pokemontcg.io\/tcgplayer\/pop4-13",
                "updatedAt": "2022\/07\/06",
                "prices": {
                    "normal": {
                        "low": 8.46,
                        "mid": 9.99,
                        "high": 25.98,
                        "market": 14.38
                    },
                    "holofoil": {
                        "low": 9,
                        "mid": 9.99,
                        "high": 21.99,
                        "market": 15.75
                    }
                }
            },
            "cardmarket": {
                "url": "https:\/\/prices.pokemontcg.io\/cardmarket\/pop4-13",
                "updatedAt": "2022\/07\/07",
                "prices": {
                    "averageSellPrice": 18.83,
                    "lowPrice": 5,
                    "trendPrice": 10.38,
                    "reverseHoloLow": 55.66,
                    "reverseHoloTrend": 16.75,
                    "lowPriceExPlus": 7,
                    "avg1": 7,
                    "avg7": 16.2,
                    "avg30": 9.74,
                    "reverseHoloAvg1": 4,
                    "reverseHoloAvg7": 13.05,
                    "reverseHoloAvg30": 9.03
                }
            }
        }
    }
}
	*/

?>