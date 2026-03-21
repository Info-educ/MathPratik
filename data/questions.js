// MathPratik - Banque de questions
// 6ème (cycle 3) + Cycle 4 : 5ème, 4ème, 3ème
// 10 questions par notion par niveau
// Programme officiel Éducation Nationale

const QUESTIONS = {

  // ══════════════════════════════════════════
  //  6ÈME
  // ══════════════════════════════════════════
  "6eme": {

    "Nombres entiers": {
      label: "Nombres entiers et grands nombres",
      icon: "🔢",
      color: "#f59e0b",
      questions: [
        {
          id: "6ne01",
          difficulte: 1,
          enonce: "Quel est le chiffre des milliers dans le nombre 4 752 316 ?",
          type: "qcm",
          choix: ["2", "5", "7", "4"],
          reponse: "2",
          explication: "Dans 4 752 316, en décomposant : 4 millions, 7 cent-milliers, 5 dizaines de milliers, 2 milliers, 3 centaines, 1 dizaine, 6 unités. Le chiffre des milliers est 2."
        },
        {
          id: "6ne02",
          difficulte: 1,
          enonce: "Écris en chiffres : « deux millions trois cent mille quarante-cinq »",
          type: "qcm",
          choix: ["2 300 045", "2 030 045", "2 300 450", "2 003 045"],
          reponse: "2 300 045",
          explication: "2 millions = 2 000 000, trois cent mille = 300 000, quarante-cinq = 45. Total : 2 300 045."
        },
        {
          id: "6ne03",
          difficulte: 1,
          enonce: "Range dans l'ordre croissant : 8 041 ; 8 410 ; 8 014 ; 8 401",
          type: "qcm",
          choix: ["8 014 < 8 041 < 8 401 < 8 410", "8 041 < 8 014 < 8 410 < 8 401", "8 014 < 8 041 < 8 410 < 8 401", "8 401 < 8 410 < 8 041 < 8 014"],
          reponse: "8 014 < 8 041 < 8 401 < 8 410",
          explication: "On compare chiffre par chiffre : tous commencent par 8 0 sauf 8 401 et 8 410. Donc : 8 014 < 8 041 < 8 401 < 8 410."
        },
        {
          id: "6ne04",
          difficulte: 1,
          enonce: "Quelle est la valeur du chiffre 6 dans 36 205 ?",
          type: "qcm",
          choix: ["6 000", "600", "60", "6"],
          reponse: "6 000",
          explication: "Le 6 est à la position des milliers. Sa valeur est donc 6 × 1 000 = 6 000."
        },
        {
          id: "6ne05",
          difficulte: 2,
          enonce: "Quel est le successeur de 99 999 ?",
          type: "qcm",
          choix: ["100 000", "99 998", "100 001", "999 999"],
          reponse: "100 000",
          explication: "Le successeur est le nombre qui suit immédiatement. 99 999 + 1 = 100 000."
        },
        {
          id: "6ne06",
          difficulte: 2,
          enonce: "Encadre 47 380 entre deux dizaines de milliers consécutives.",
          type: "qcm",
          choix: ["40 000 < 47 380 < 50 000", "47 000 < 47 380 < 48 000", "40 000 < 47 380 < 40 001", "45 000 < 47 380 < 50 000"],
          reponse: "40 000 < 47 380 < 50 000",
          explication: "Les dizaines de milliers autour de 47 380 sont 40 000 et 50 000."
        },
        {
          id: "6ne07",
          difficulte: 2,
          enonce: "Quel est le quotient et le reste de la division euclidienne de 137 par 5 ?",
          type: "qcm",
          choix: ["Quotient 27, reste 2", "Quotient 27, reste 1", "Quotient 28, reste 3", "Quotient 26, reste 7"],
          reponse: "Quotient 27, reste 2",
          explication: "5 × 27 = 135. 137 - 135 = 2. Donc 137 = 5 × 27 + 2. Quotient = 27, reste = 2."
        },
        {
          id: "6ne08",
          difficulte: 2,
          enonce: "Quels sont les diviseurs de 12 ?",
          type: "qcm",
          choix: ["1, 2, 3, 4, 6, 12", "1, 2, 3, 6, 12", "2, 3, 4, 6", "1, 2, 4, 6, 12"],
          reponse: "1, 2, 3, 4, 6, 12",
          explication: "12 = 1×12 = 2×6 = 3×4. Les diviseurs sont : 1, 2, 3, 4, 6, 12."
        },
        {
          id: "6ne09",
          difficulte: 3,
          enonce: "Est-ce que 7 est un multiple de 3 ?",
          type: "qcm",
          choix: ["Non, 7 ÷ 3 n'est pas entier", "Oui, car 7 > 3", "Oui, car 3 × 2 = 6", "Non, car 7 est impair"],
          reponse: "Non, 7 ÷ 3 n'est pas entier",
          explication: "Un multiple de 3 s'écrit 3×n avec n entier. 7 = 3×2+1 → 7 n'est pas un multiple de 3."
        },
        {
          id: "6ne10",
          difficulte: 3,
          enonce: "Quel est le plus grand nombre de 5 chiffres ?",
          type: "qcm",
          choix: ["99 999", "100 000", "99 990", "98 765"],
          reponse: "99 999",
          explication: "Le plus grand nombre à 5 chiffres est 99 999 (cinq 9). Le suivant, 100 000, a 6 chiffres."
        }
      ]
    },

    "Nombres decimaux": {
      label: "Nombres décimaux",
      icon: "🔡",
      color: "#0ea5e9",
      questions: [
        {
          id: "6nd01",
          difficulte: 1,
          enonce: "Quel est le chiffre des centièmes dans 3,847 ?",
          type: "qcm",
          choix: ["4", "8", "7", "3"],
          reponse: "4",
          explication: "3,847 : 3 unités, 8 dixièmes, 4 centièmes, 7 millièmes. Le chiffre des centièmes est 4."
        },
        {
          id: "6nd02",
          difficulte: 1,
          enonce: "Lequel est le plus grand : 0,35 ou 0,305 ?",
          type: "qcm",
          choix: ["0,35", "0,305", "Ils sont égaux", "On ne peut pas comparer"],
          reponse: "0,35",
          explication: "0,35 = 0,350 et 0,305. En comparant centième par centième : 350 > 305, donc 0,35 > 0,305."
        },
        {
          id: "6nd03",
          difficulte: 1,
          enonce: "Écris sous forme décimale : 7 + 3/10 + 5/100",
          type: "qcm",
          choix: ["7,35", "7,305", "73,5", "7,053"],
          reponse: "7,35",
          explication: "7 unités, 3 dixièmes (0,3), 5 centièmes (0,05). Total : 7 + 0,3 + 0,05 = 7,35."
        },
        {
          id: "6nd04",
          difficulte: 1,
          enonce: "Arrondi 4,762 au dixième.",
          type: "qcm",
          choix: ["4,8", "4,7", "5,0", "4,76"],
          reponse: "4,8",
          explication: "On regarde le chiffre des centièmes : 6 ≥ 5, donc on arrondit le dixième par excès. 4,762 ≈ 4,8."
        },
        {
          id: "6nd05",
          difficulte: 2,
          enonce: "Calcule : 2,4 + 0,76",
          type: "qcm",
          choix: ["3,16", "3,06", "2,836", "3,1"],
          reponse: "3,16",
          explication: "On aligne les virgules : 2,40 + 0,76 = 3,16."
        },
        {
          id: "6nd06",
          difficulte: 2,
          enonce: "Calcule : 5,3 − 1,87",
          type: "qcm",
          choix: ["3,43", "3,53", "4,43", "3,40"],
          reponse: "3,43",
          explication: "5,30 − 1,87 = 3,43. On aligne les virgules et on soustrait colonne par colonne."
        },
        {
          id: "6nd07",
          difficulte: 2,
          enonce: "Calcule : 0,6 × 0,4",
          type: "qcm",
          choix: ["0,24", "2,4", "0,024", "0,10"],
          reponse: "0,24",
          explication: "6 × 4 = 24. Il y a 2 décimales au total (1+1). Donc 0,6 × 0,4 = 0,24."
        },
        {
          id: "6nd08",
          difficulte: 2,
          enonce: "Quel est l'encadrement de 6,37 à l'unité ?",
          type: "qcm",
          choix: ["6 < 6,37 < 7", "5 < 6,37 < 7", "6 < 6,37 < 6,5", "6,3 < 6,37 < 6,4"],
          reponse: "6 < 6,37 < 7",
          explication: "Encadrer à l'unité signifie trouver les deux entiers consécutifs. 6 < 6,37 < 7."
        },
        {
          id: "6nd09",
          difficulte: 3,
          enonce: "Place sur une droite graduée : quel nombre est entre 1,2 et 1,4 ?",
          type: "qcm",
          choix: ["1,3", "0,3", "1,5", "1,14"],
          reponse: "1,3",
          explication: "1,2 < 1,3 < 1,4. La valeur 1,3 est bien comprise entre 1,2 et 1,4."
        },
        {
          id: "6nd10",
          difficulte: 3,
          enonce: "Convertis 3,5 km en mètres.",
          type: "qcm",
          choix: ["3 500 m", "350 m", "35 m", "3 050 m"],
          reponse: "3 500 m",
          explication: "1 km = 1 000 m. Donc 3,5 km = 3,5 × 1 000 = 3 500 m."
        }
      ]
    },

    "Fractions": {
      label: "Fractions",
      icon: "½",
      color: "#a855f7",
      questions: [
        {
          id: "6fr01",
          difficulte: 1,
          enonce: "Quelle fraction représente la partie coloriée si 3 parts sur 8 sont colorées ?",
          type: "qcm",
          choix: ["3/8", "8/3", "5/8", "3/5"],
          reponse: "3/8",
          explication: "La fraction est : nombre de parts colorées / nombre total de parts = 3/8."
        },
        {
          id: "6fr02",
          difficulte: 1,
          enonce: "Quelle fraction est égale à 1/2 ?",
          type: "qcm",
          choix: ["3/6", "2/5", "4/6", "1/4"],
          reponse: "3/6",
          explication: "3/6 = 3÷3 / 6÷3 = 1/2. On divise numérateur et dénominateur par 3."
        },
        {
          id: "6fr03",
          difficulte: 1,
          enonce: "Calcule : 1/4 + 2/4",
          type: "qcm",
          choix: ["3/4", "3/8", "1/2", "2/4"],
          reponse: "3/4",
          explication: "Les fractions ont le même dénominateur : 1/4 + 2/4 = (1+2)/4 = 3/4."
        },
        {
          id: "6fr04",
          difficulte: 1,
          enonce: "Compare : 2/3 et 3/4",
          type: "qcm",
          choix: ["2/3 < 3/4", "2/3 > 3/4", "2/3 = 3/4", "On ne peut pas comparer"],
          reponse: "2/3 < 3/4",
          explication: "Réduit au même dénominateur : 2/3 = 8/12 et 3/4 = 9/12. Donc 8/12 < 9/12, soit 2/3 < 3/4."
        },
        {
          id: "6fr05",
          difficulte: 2,
          enonce: "Quelle est la partie entière de 17/5 ?",
          type: "qcm",
          choix: ["3", "4", "2", "5"],
          reponse: "3",
          explication: "17 ÷ 5 = 3 reste 2. Donc 17/5 = 3 + 2/5. La partie entière est 3."
        },
        {
          id: "6fr06",
          difficulte: 2,
          enonce: "Écris 2,75 sous forme de fraction.",
          type: "qcm",
          choix: ["11/4", "275/10", "27/5", "11/5"],
          reponse: "11/4",
          explication: "2,75 = 275/100 = 11/4 (on simplifie par 25). Ou : 2,75 = 2 + 3/4 = 8/4 + 3/4 = 11/4."
        },
        {
          id: "6fr07",
          difficulte: 2,
          enonce: "Calcule : 3/5 de 20",
          type: "qcm",
          choix: ["12", "15", "10", "6"],
          reponse: "12",
          explication: "3/5 de 20 = 3 × 20/5 = 3 × 4 = 12."
        },
        {
          id: "6fr08",
          difficulte: 2,
          enonce: "Quelle fraction est supérieure à 1 ?",
          type: "qcm",
          choix: ["7/5", "3/4", "5/7", "2/3"],
          reponse: "7/5",
          explication: "Une fraction est supérieure à 1 quand le numérateur est plus grand que le dénominateur. 7 > 5 donc 7/5 > 1."
        },
        {
          id: "6fr09",
          difficulte: 3,
          enonce: "Simplifie la fraction 15/20.",
          type: "qcm",
          choix: ["3/4", "5/4", "2/3", "15/20"],
          reponse: "3/4",
          explication: "PGCD(15, 20) = 5. On divise par 5 : 15/20 = 3/4."
        },
        {
          id: "6fr10",
          difficulte: 3,
          enonce: "Quel est le résultat de 1/3 + 1/6 ?",
          type: "qcm",
          choix: ["1/2", "2/9", "2/6", "1/9"],
          reponse: "1/2",
          explication: "Dénominateur commun : 6. 1/3 = 2/6. Donc 2/6 + 1/6 = 3/6 = 1/2."
        }
      ]
    },

    "Calcul numerique": {
      label: "Calcul numérique (opérations, priorités)",
      icon: "🧮",
      color: "#ef4444",
      questions: [
        {
          id: "6ca01",
          difficulte: 1,
          enonce: "Calcule : 4 + 3 × 5",
          type: "qcm",
          choix: ["19", "35", "23", "17"],
          reponse: "19",
          explication: "Les multiplications sont prioritaires sur les additions. 3 × 5 = 15, puis 4 + 15 = 19."
        },
        {
          id: "6ca02",
          difficulte: 1,
          enonce: "Calcule : (4 + 3) × 5",
          type: "qcm",
          choix: ["35", "19", "23", "12"],
          reponse: "35",
          explication: "Les parenthèses sont prioritaires. (4 + 3) = 7, puis 7 × 5 = 35."
        },
        {
          id: "6ca03",
          difficulte: 1,
          enonce: "Calcule : 48 ÷ 6 + 2 × 3",
          type: "qcm",
          choix: ["14", "28", "10", "30"],
          reponse: "14",
          explication: "Priorités × et ÷ d'abord : 48÷6 = 8 et 2×3 = 6. Puis 8 + 6 = 14."
        },
        {
          id: "6ca04",
          difficulte: 1,
          enonce: "Calcule : 100 − 4 × (3 + 2)",
          type: "qcm",
          choix: ["80", "60", "75", "85"],
          reponse: "80",
          explication: "Parenthèses : (3+2) = 5. Multiplication : 4×5 = 20. Soustraction : 100 − 20 = 80."
        },
        {
          id: "6ca05",
          difficulte: 2,
          enonce: "Pose et calcule : 375 × 24",
          type: "qcm",
          choix: ["9 000", "8 900", "9 100", "7 500"],
          reponse: "9 000",
          explication: "375 × 24 = 375 × 20 + 375 × 4 = 7 500 + 1 500 = 9 000."
        },
        {
          id: "6ca06",
          difficulte: 2,
          enonce: "Calcule : 3² + 4²",
          type: "qcm",
          choix: ["25", "49", "14", "7"],
          reponse: "25",
          explication: "3² = 9 et 4² = 16. Donc 9 + 16 = 25. (C'est aussi 5², triangle 3-4-5 !)"
        },
        {
          id: "6ca07",
          difficulte: 2,
          enonce: "Quel est le carré de 12 ?",
          type: "qcm",
          choix: ["144", "24", "121", "164"],
          reponse: "144",
          explication: "12² = 12 × 12 = 144."
        },
        {
          id: "6ca08",
          difficulte: 2,
          enonce: "Calcule : 5 + 3² × 2 − 1",
          type: "qcm",
          choix: ["22", "32", "19", "18"],
          reponse: "22",
          explication: "Puissance d'abord : 3² = 9. Puis multiplication : 9×2 = 18. Puis : 5 + 18 − 1 = 22."
        },
        {
          id: "6ca09",
          difficulte: 3,
          enonce: "Effectue la division : 1 296 ÷ 12",
          type: "qcm",
          choix: ["108", "98", "118", "112"],
          reponse: "108",
          explication: "12 × 100 = 1 200. 1 296 − 1 200 = 96. 96 ÷ 12 = 8. Total : 100 + 8 = 108."
        },
        {
          id: "6ca10",
          difficulte: 3,
          enonce: "Calcule : 2 × (8 − 3)² − 4",
          type: "qcm",
          choix: ["46", "41", "6", "46"],
          reponse: "46",
          explication: "Parenthèses : (8−3) = 5. Puissance : 5² = 25. Multiplication : 2×25 = 50. Puis : 50 − 4 = 46."
        }
      ]
    },

    "Proportionnalite": {
      label: "Proportionnalité et pourcentages",
      icon: "📐",
      color: "#10b981",
      questions: [
        {
          id: "6pp01",
          difficulte: 1,
          enonce: "Si 2 cahiers coûtent 3 €, combien coûtent 6 cahiers ?",
          type: "qcm",
          choix: ["9 €", "6 €", "12 €", "8 €"],
          reponse: "9 €",
          explication: "Prix d'1 cahier : 3÷2 = 1,50 €. Pour 6 cahiers : 6 × 1,50 = 9 €."
        },
        {
          id: "6pp02",
          difficulte: 1,
          enonce: "Un tableau est proportionnel si :",
          type: "qcm",
          choix: ["Le rapport entre deux valeurs est constant", "Les valeurs s'ajoutent", "Les valeurs sont grandes", "Il a deux colonnes"],
          reponse: "Le rapport entre deux valeurs est constant",
          explication: "Proportionnalité : y/x = k (coefficient de proportionnalité), constante pour toutes les paires."
        },
        {
          id: "6pp03",
          difficulte: 1,
          enonce: "Quel est 25% de 80 ?",
          type: "qcm",
          choix: ["20", "25", "40", "15"],
          reponse: "20",
          explication: "25% = 25/100 = 1/4. Donc 25% de 80 = 80 ÷ 4 = 20."
        },
        {
          id: "6pp04",
          difficulte: 1,
          enonce: "Un article coûte 50 €. Une réduction de 10% est appliquée. Nouveau prix ?",
          type: "qcm",
          choix: ["45 €", "40 €", "55 €", "48 €"],
          reponse: "45 €",
          explication: "10% de 50 = 5 €. Prix après réduction : 50 − 5 = 45 €."
        },
        {
          id: "6pp05",
          difficulte: 2,
          enonce: "Sur une carte à l'échelle 1/100 000, une route mesure 3 cm. Sa longueur réelle est :",
          type: "qcm",
          choix: ["3 km", "30 km", "0,3 km", "300 km"],
          reponse: "3 km",
          explication: "Longueur réelle = 3 × 100 000 = 300 000 cm = 3 000 m = 3 km."
        },
        {
          id: "6pp06",
          difficulte: 2,
          enonce: "Quel pourcentage représente 15 sur 60 ?",
          type: "qcm",
          choix: ["25%", "15%", "20%", "30%"],
          reponse: "25%",
          explication: "15/60 = 1/4 = 0,25 = 25%."
        },
        {
          id: "6pp07",
          difficulte: 2,
          enonce: "Une voiture roule à 90 km/h. En 2 heures, elle parcourt :",
          type: "qcm",
          choix: ["180 km", "45 km", "90 km", "270 km"],
          reponse: "180 km",
          explication: "Distance = vitesse × temps = 90 × 2 = 180 km."
        },
        {
          id: "6pp08",
          difficulte: 2,
          enonce: "Les grandeurs vitesse et temps sont-elles proportionnelles (pour une distance fixe) ?",
          type: "qcm",
          choix: ["Non, elles sont inversement proportionnelles", "Oui", "Cela dépend de la distance", "Non, elles sont indépendantes"],
          reponse: "Non, elles sont inversement proportionnelles",
          explication: "Si la distance est fixe : d = v × t, donc t = d/v. Quand v augmente, t diminue → inversement proportionnel."
        },
        {
          id: "6pp09",
          difficulte: 3,
          enonce: "Complete le tableau de proportionnalité : 3 → 12 ; 5 → ?",
          type: "qcm",
          choix: ["20", "15", "25", "8"],
          reponse: "20",
          explication: "Coefficient : 12/3 = 4. Donc 5 → 5 × 4 = 20."
        },
        {
          id: "6pp10",
          difficulte: 3,
          enonce: "12 est 30% de quel nombre ?",
          type: "qcm",
          choix: ["40", "36", "30", "60"],
          reponse: "40",
          explication: "30% × n = 12. n = 12 ÷ 0,30 = 40."
        }
      ]
    },

    "Longueurs perimetre": {
      label: "Longueurs, périmètres, cercle",
      icon: "📏",
      color: "#06b6d4",
      questions: [
        {
          id: "6lp01",
          difficulte: 1,
          enonce: "Quel est le périmètre d'un rectangle de longueur 8 cm et largeur 5 cm ?",
          type: "qcm",
          choix: ["26 cm", "40 cm", "13 cm", "24 cm"],
          reponse: "26 cm",
          explication: "P = 2 × (longueur + largeur) = 2 × (8 + 5) = 2 × 13 = 26 cm."
        },
        {
          id: "6lp02",
          difficulte: 1,
          enonce: "Quel est le périmètre d'un carré de côté 7 cm ?",
          type: "qcm",
          choix: ["28 cm", "49 cm", "14 cm", "21 cm"],
          reponse: "28 cm",
          explication: "Périmètre d'un carré = 4 × côté = 4 × 7 = 28 cm."
        },
        {
          id: "6lp03",
          difficulte: 1,
          enonce: "Convertis 2,5 m en centimètres.",
          type: "qcm",
          choix: ["250 cm", "25 cm", "2 500 cm", "0,025 cm"],
          reponse: "250 cm",
          explication: "1 m = 100 cm. Donc 2,5 m = 2,5 × 100 = 250 cm."
        },
        {
          id: "6lp04",
          difficulte: 1,
          enonce: "La circonférence d'un cercle de diamètre 10 cm est (π ≈ 3,14) :",
          type: "qcm",
          choix: ["31,4 cm", "62,8 cm", "78,5 cm", "15,7 cm"],
          reponse: "31,4 cm",
          explication: "Circonférence = π × d = 3,14 × 10 = 31,4 cm."
        },
        {
          id: "6lp05",
          difficulte: 2,
          enonce: "Le rayon d'un cercle est la moitié :",
          type: "qcm",
          choix: ["Du diamètre", "De la circonférence", "De l'arc", "Du périmètre"],
          reponse: "Du diamètre",
          explication: "Le rayon r est la distance du centre à un point du cercle. Le diamètre d = 2r, donc r = d/2."
        },
        {
          id: "6lp06",
          difficulte: 2,
          enonce: "Un triangle équilatéral a un périmètre de 24 cm. Quelle est la longueur d'un côté ?",
          type: "qcm",
          choix: ["8 cm", "6 cm", "12 cm", "4 cm"],
          reponse: "8 cm",
          explication: "Triangle équilatéral : 3 côtés égaux. Côté = périmètre ÷ 3 = 24 ÷ 3 = 8 cm."
        },
        {
          id: "6lp07",
          difficulte: 2,
          enonce: "Convertis 3 450 m en km.",
          type: "qcm",
          choix: ["3,45 km", "34,5 km", "0,345 km", "345 km"],
          reponse: "3,45 km",
          explication: "1 km = 1 000 m. Donc 3 450 m = 3 450 ÷ 1 000 = 3,45 km."
        },
        {
          id: "6lp08",
          difficulte: 2,
          enonce: "Quel est le périmètre d'un triangle isocèle de côtés 5 cm, 5 cm et 8 cm ?",
          type: "qcm",
          choix: ["18 cm", "20 cm", "13 cm", "16 cm"],
          reponse: "18 cm",
          explication: "P = somme des côtés = 5 + 5 + 8 = 18 cm."
        },
        {
          id: "6lp09",
          difficulte: 3,
          enonce: "Le diamètre d'un cercle de rayon 6 cm est :",
          type: "qcm",
          choix: ["12 cm", "6 cm", "3 cm", "18 cm"],
          reponse: "12 cm",
          explication: "Diamètre = 2 × rayon = 2 × 6 = 12 cm."
        },
        {
          id: "6lp10",
          difficulte: 3,
          enonce: "Un rectangle a un périmètre de 30 cm et une longueur de 10 cm. Quelle est sa largeur ?",
          type: "qcm",
          choix: ["5 cm", "10 cm", "20 cm", "15 cm"],
          reponse: "5 cm",
          explication: "P = 2(L + l). 30 = 2(10 + l). 15 = 10 + l. l = 5 cm."
        }
      ]
    },

    "Aires": {
      label: "Grandeurs et mesures — Aires",
      icon: "⬜",
      color: "#f97316",
      questions: [
        {
          id: "6ai01",
          difficulte: 1,
          enonce: "Quelle est l'aire d'un rectangle de longueur 9 cm et largeur 4 cm ?",
          type: "qcm",
          choix: ["36 cm²", "26 cm²", "13 cm²", "72 cm²"],
          reponse: "36 cm²",
          explication: "Aire d'un rectangle = longueur × largeur = 9 × 4 = 36 cm²."
        },
        {
          id: "6ai02",
          difficulte: 1,
          enonce: "Quelle est l'aire d'un carré de côté 6 cm ?",
          type: "qcm",
          choix: ["36 cm²", "24 cm²", "12 cm²", "216 cm²"],
          reponse: "36 cm²",
          explication: "Aire d'un carré = côté² = 6² = 36 cm²."
        },
        {
          id: "6ai03",
          difficulte: 1,
          enonce: "Quelle est l'aire d'un triangle de base 10 cm et hauteur 6 cm ?",
          type: "qcm",
          choix: ["30 cm²", "60 cm²", "16 cm²", "80 cm²"],
          reponse: "30 cm²",
          explication: "Aire d'un triangle = base × hauteur ÷ 2 = 10 × 6 ÷ 2 = 30 cm²."
        },
        {
          id: "6ai04",
          difficulte: 1,
          enonce: "Convertis 2 m² en cm².",
          type: "qcm",
          choix: ["20 000 cm²", "2 000 cm²", "200 cm²", "200 000 cm²"],
          reponse: "20 000 cm²",
          explication: "1 m² = 10 000 cm² (car 1 m = 100 cm, donc 100² = 10 000). Donc 2 m² = 20 000 cm²."
        },
        {
          id: "6ai05",
          difficulte: 2,
          enonce: "Quelle est l'aire d'un disque de rayon 5 cm ? (π ≈ 3,14)",
          type: "qcm",
          choix: ["78,5 cm²", "31,4 cm²", "157 cm²", "25 cm²"],
          reponse: "78,5 cm²",
          explication: "Aire = π × r² = 3,14 × 5² = 3,14 × 25 = 78,5 cm²."
        },
        {
          id: "6ai06",
          difficulte: 2,
          enonce: "Un carré et un rectangle ont-ils la même aire si le carré a un côté de 6 cm et le rectangle mesure 4 cm × 9 cm ?",
          type: "qcm",
          choix: ["Oui, 36 cm² chacun", "Non, carré plus grand", "Non, rectangle plus grand", "On ne peut pas savoir"],
          reponse: "Oui, 36 cm² chacun",
          explication: "Carré : 6² = 36 cm². Rectangle : 4 × 9 = 36 cm². Aires égales !"
        },
        {
          id: "6ai07",
          difficulte: 2,
          enonce: "Quelle est l'unité d'aire la plus adaptée pour mesurer l'aire d'une cour d'école ?",
          type: "qcm",
          choix: ["m²", "cm²", "mm²", "km²"],
          reponse: "m²",
          explication: "Le m² est l'unité adaptée aux surfaces de taille humaine comme une cour. Le cm² est trop petit, le km² trop grand."
        },
        {
          id: "6ai08",
          difficulte: 2,
          enonce: "Un trapèze a des bases de 4 cm et 6 cm, et une hauteur de 5 cm. Son aire est :",
          type: "qcm",
          choix: ["25 cm²", "50 cm²", "30 cm²", "20 cm²"],
          reponse: "25 cm²",
          explication: "Aire = (b₁+b₂)/2 × h = (4+6)/2 × 5 = 5 × 5 = 25 cm²."
        },
        {
          id: "6ai09",
          difficulte: 3,
          enonce: "Convertis 5 000 m² en hectares.",
          type: "qcm",
          choix: ["0,5 ha", "5 ha", "50 ha", "0,05 ha"],
          reponse: "0,5 ha",
          explication: "1 ha = 10 000 m². Donc 5 000 m² = 5 000 ÷ 10 000 = 0,5 ha."
        },
        {
          id: "6ai10",
          difficulte: 3,
          enonce: "Un triangle rectangle a des cathètes de 3 cm et 4 cm. Son aire est :",
          type: "qcm",
          choix: ["6 cm²", "12 cm²", "7 cm²", "5 cm²"],
          reponse: "6 cm²",
          explication: "Aire = base × hauteur ÷ 2 = 3 × 4 ÷ 2 = 6 cm². (Les deux cathètes sont la base et la hauteur.)"
        }
      ]
    },

    "Volumes": {
      label: "Grandeurs et mesures — Volumes",
      icon: "📦",
      color: "#8b5cf6",
      questions: [
        {
          id: "6vo01",
          difficulte: 1,
          enonce: "Quelle est le volume d'un cube d'arête 3 cm ?",
          type: "qcm",
          choix: ["27 cm³", "9 cm³", "18 cm³", "54 cm³"],
          reponse: "27 cm³",
          explication: "Volume d'un cube = arête³ = 3³ = 27 cm³."
        },
        {
          id: "6vo02",
          difficulte: 1,
          enonce: "Volume d'un pavé droit de 5 cm × 4 cm × 3 cm ?",
          type: "qcm",
          choix: ["60 cm³", "47 cm³", "80 cm³", "24 cm³"],
          reponse: "60 cm³",
          explication: "Volume = longueur × largeur × hauteur = 5 × 4 × 3 = 60 cm³."
        },
        {
          id: "6vo03",
          difficulte: 1,
          enonce: "Convertis 2 L en mL.",
          type: "qcm",
          choix: ["2 000 mL", "200 mL", "20 mL", "20 000 mL"],
          reponse: "2 000 mL",
          explication: "1 L = 1 000 mL. Donc 2 L = 2 × 1 000 = 2 000 mL."
        },
        {
          id: "6vo04",
          difficulte: 1,
          enonce: "Quelle est la contenance d'une bouteille de 75 cL en mL ?",
          type: "qcm",
          choix: ["750 mL", "75 mL", "7 500 mL", "7,5 mL"],
          reponse: "750 mL",
          explication: "1 cL = 10 mL. Donc 75 cL = 75 × 10 = 750 mL."
        },
        {
          id: "6vo05",
          difficulte: 2,
          enonce: "1 cm³ = ?",
          type: "qcm",
          choix: ["1 mL", "1 L", "10 mL", "0,1 L"],
          reponse: "1 mL",
          explication: "Par définition : 1 cm³ = 1 mL. C'est une équivalence fondamentale entre volume et contenance."
        },
        {
          id: "6vo06",
          difficulte: 2,
          enonce: "Une piscine rectangulaire mesure 10 m × 5 m × 2 m. Son volume en m³ est :",
          type: "qcm",
          choix: ["100 m³", "50 m³", "200 m³", "17 m³"],
          reponse: "100 m³",
          explication: "V = 10 × 5 × 2 = 100 m³."
        },
        {
          id: "6vo07",
          difficulte: 2,
          enonce: "Convertis 3,5 m³ en litres.",
          type: "qcm",
          choix: ["3 500 L", "35 L", "350 L", "35 000 L"],
          reponse: "3 500 L",
          explication: "1 m³ = 1 000 L. Donc 3,5 m³ = 3 500 L."
        },
        {
          id: "6vo08",
          difficulte: 2,
          enonce: "Un cube contient 8 L d'eau. Quelle est la longueur de son arête ? (1 L = 1 dm³)",
          type: "qcm",
          choix: ["2 dm", "4 dm", "8 dm", "1 dm"],
          reponse: "2 dm",
          explication: "8 L = 8 dm³. Arête = ∛8 = 2 dm."
        },
        {
          id: "6vo09",
          difficulte: 3,
          enonce: "Quelle unité est la mieux adaptée pour le volume d'un dé à jouer ?",
          type: "qcm",
          choix: ["cm³", "m³", "dm³", "L"],
          reponse: "cm³",
          explication: "Un dé à jouer a des dimensions en centimètres, donc son volume se mesure en cm³."
        },
        {
          id: "6vo10",
          difficulte: 3,
          enonce: "Convertis 4 500 cm³ en litres.",
          type: "qcm",
          choix: ["4,5 L", "45 L", "0,45 L", "450 L"],
          reponse: "4,5 L",
          explication: "1 L = 1 dm³ = 1 000 cm³. Donc 4 500 cm³ = 4 500 ÷ 1 000 = 4,5 L."
        }
      ]
    },

    "Angles": {
      label: "Angles",
      icon: "📐",
      color: "#ec4899",
      questions: [
        {
          id: "6an01",
          difficulte: 1,
          enonce: "Un angle droit mesure :",
          type: "qcm",
          choix: ["90°", "45°", "180°", "60°"],
          reponse: "90°",
          explication: "Par définition, un angle droit mesure exactement 90°."
        },
        {
          id: "6an02",
          difficulte: 1,
          enonce: "Un angle de 130° est :",
          type: "qcm",
          choix: ["Obtus", "Aigu", "Droit", "Plat"],
          reponse: "Obtus",
          explication: "Un angle obtus est supérieur à 90° et inférieur à 180°. 130° est bien obtus."
        },
        {
          id: "6an03",
          difficulte: 1,
          enonce: "Deux angles sont complémentaires. L'un mesure 35°. L'autre mesure :",
          type: "qcm",
          choix: ["55°", "145°", "65°", "35°"],
          reponse: "55°",
          explication: "Deux angles complémentaires ont une somme de 90°. 90° − 35° = 55°."
        },
        {
          id: "6an04",
          difficulte: 1,
          enonce: "Deux angles sont supplémentaires. L'un mesure 70°. L'autre mesure :",
          type: "qcm",
          choix: ["110°", "20°", "290°", "70°"],
          reponse: "110°",
          explication: "Deux angles supplémentaires ont une somme de 180°. 180° − 70° = 110°."
        },
        {
          id: "6an05",
          difficulte: 2,
          enonce: "Quelle est la somme des angles d'un triangle ?",
          type: "qcm",
          choix: ["180°", "360°", "90°", "270°"],
          reponse: "180°",
          explication: "La somme des trois angles d'un triangle est toujours égale à 180°."
        },
        {
          id: "6an06",
          difficulte: 2,
          enonce: "Un angle plat mesure :",
          type: "qcm",
          choix: ["180°", "90°", "360°", "0°"],
          reponse: "180°",
          explication: "Un angle plat correspond à une demi-rotation, soit 180°."
        },
        {
          id: "6an07",
          difficulte: 2,
          enonce: "Deux droites perpendiculaires forment quel type d'angle ?",
          type: "qcm",
          choix: ["Droit", "Aigu", "Obtus", "Plat"],
          reponse: "Droit",
          explication: "Des droites perpendiculaires se coupent en formant des angles droits (90°)."
        },
        {
          id: "6an08",
          difficulte: 2,
          enonce: "Un angle aigu est un angle :",
          type: "qcm",
          choix: ["Strictement inférieur à 90°", "Supérieur à 90°", "Égal à 90°", "Égal à 180°"],
          reponse: "Strictement inférieur à 90°",
          explication: "Un angle aigu mesure entre 0° et 90° (exclu). Il est 'pointu'."
        },
        {
          id: "6an09",
          difficulte: 3,
          enonce: "Dans un triangle, deux angles mesurent 60° et 80°. Le troisième mesure :",
          type: "qcm",
          choix: ["40°", "20°", "50°", "100°"],
          reponse: "40°",
          explication: "La somme des angles d'un triangle est 180°. 3ème angle = 180 − 60 − 80 = 40°."
        },
        {
          id: "6an10",
          difficulte: 3,
          enonce: "Deux angles opposés par le sommet sont :",
          type: "qcm",
          choix: ["Égaux", "Supplémentaires", "Complémentaires", "Différents"],
          reponse: "Égaux",
          explication: "Quand deux droites se coupent, les angles opposés par le sommet (en croix) sont toujours égaux."
        }
      ]
    },

    "Figures geometriques": {
      label: "Figures géométriques",
      icon: "🔷",
      color: "#14b8a6",
      questions: [
        {
          id: "6fg01",
          difficulte: 1,
          enonce: "Un triangle équilatéral a :",
          type: "qcm",
          choix: ["3 côtés égaux et 3 angles de 60°", "2 côtés égaux", "1 angle droit", "4 côtés"],
          reponse: "3 côtés égaux et 3 angles de 60°",
          explication: "Triangle équilatéral : tous les côtés sont égaux et tous les angles mesurent 60°."
        },
        {
          id: "6fg02",
          difficulte: 1,
          enonce: "Quel quadrilatère a 4 côtés égaux et 4 angles droits ?",
          type: "qcm",
          choix: ["Carré", "Rectangle", "Losange", "Parallélogramme"],
          reponse: "Carré",
          explication: "Le carré est le seul quadrilatère avec à la fois 4 côtés égaux ET 4 angles droits."
        },
        {
          id: "6fg03",
          difficulte: 1,
          enonce: "Un losange est un quadrilatère qui a :",
          type: "qcm",
          choix: ["4 côtés égaux", "4 angles droits", "2 paires de côtés parallèles inégaux", "1 axe de symétrie"],
          reponse: "4 côtés égaux",
          explication: "Le losange a 4 côtés de même longueur, mais ses angles ne sont pas nécessairement droits."
        },
        {
          id: "6fg04",
          difficulte: 1,
          enonce: "Un triangle isocèle possède :",
          type: "qcm",
          choix: ["Au moins 2 côtés égaux", "3 côtés égaux", "1 angle obtus", "Aucun côté égal"],
          reponse: "Au moins 2 côtés égaux",
          explication: "Un triangle isocèle a exactement 2 côtés égaux (et les angles à la base de ces côtés sont aussi égaux)."
        },
        {
          id: "6fg05",
          difficulte: 2,
          enonce: "Combien d'axes de symétrie possède un rectangle (non carré) ?",
          type: "qcm",
          choix: ["2", "4", "0", "1"],
          reponse: "2",
          explication: "Un rectangle possède 2 axes de symétrie : les deux médiatrices des côtés (horizontale et verticale)."
        },
        {
          id: "6fg06",
          difficulte: 2,
          enonce: "Un parallélogramme est un quadrilatère dont :",
          type: "qcm",
          choix: ["Les côtés opposés sont parallèles deux à deux", "Les 4 côtés sont égaux", "Les 4 angles sont droits", "Les diagonales sont égales"],
          reponse: "Les côtés opposés sont parallèles deux à deux",
          explication: "Par définition, un parallélogramme a ses côtés opposés parallèles (et égaux)."
        },
        {
          id: "6fg07",
          difficulte: 2,
          enonce: "Un triangle rectangle possède :",
          type: "qcm",
          choix: ["Un angle de 90°", "Deux angles de 90°", "3 côtés égaux", "Aucun angle obtus"],
          reponse: "Un angle de 90°",
          explication: "Un triangle ne peut avoir qu'un seul angle droit (car la somme des angles = 180°)."
        },
        {
          id: "6fg08",
          difficulte: 2,
          enonce: "Combien de côtés possède un hexagone ?",
          type: "qcm",
          choix: ["6", "5", "7", "8"],
          reponse: "6",
          explication: "Hexa = 6 en grec. Un hexagone possède 6 côtés et 6 sommets."
        },
        {
          id: "6fg09",
          difficulte: 3,
          enonce: "Le rectangle est un cas particulier de :",
          type: "qcm",
          choix: ["Parallélogramme", "Losange", "Trapèze seulement", "Carré"],
          reponse: "Parallélogramme",
          explication: "Un rectangle est un parallélogramme avec des angles droits. Il hérite des propriétés du parallélogramme."
        },
        {
          id: "6fg10",
          difficulte: 3,
          enonce: "Un trapèze est un quadrilatère qui a :",
          type: "qcm",
          choix: ["Exactement une paire de côtés parallèles", "4 côtés égaux", "4 angles droits", "Deux paires de côtés parallèles"],
          reponse: "Exactement une paire de côtés parallèles",
          explication: "Un trapèze a exactement une paire de côtés parallèles appelés les bases."
        }
      ]
    },

    "Symetrie": {
      label: "Symétrie axiale et médiatrice",
      icon: "🪞",
      color: "#64748b",
      questions: [
        {
          id: "6sy01",
          difficulte: 1,
          enonce: "Le symétrique d'un point par rapport à un axe est :",
          type: "qcm",
          choix: ["À la même distance de l'axe, de l'autre côté", "Sur l'axe", "Au double de la distance", "N'existe pas"],
          reponse: "À la même distance de l'axe, de l'autre côté",
          explication: "La symétrie axiale est comme un 'miroir' : le point image est à la même distance de l'axe, de l'autre côté."
        },
        {
          id: "6sy02",
          difficulte: 1,
          enonce: "La médiatrice d'un segment est :",
          type: "qcm",
          choix: ["La droite perpendiculaire au segment passant par son milieu", "La droite parallèle au segment", "Le milieu du segment", "Un angle du segment"],
          reponse: "La droite perpendiculaire au segment passant par son milieu",
          explication: "La médiatrice est à la fois perpendiculaire au segment et passe par son milieu."
        },
        {
          id: "6sy03",
          difficulte: 1,
          enonce: "Tout point de la médiatrice d'un segment [AB] est :",
          type: "qcm",
          choix: ["Équidistant de A et de B", "Sur le segment [AB]", "Plus proche de A que de B", "À distance nulle de A"],
          reponse: "Équidistant de A et de B",
          explication: "C'est la propriété fondamentale : tout point de la médiatrice est à égale distance des deux extrémités."
        },
        {
          id: "6sy04",
          difficulte: 1,
          enonce: "Une figure a un axe de symétrie si :",
          type: "qcm",
          choix: ["Elle se superpose à elle-même par pliage sur cet axe", "Elle est grande", "Elle a 4 côtés", "Elle est colorée"],
          reponse: "Elle se superpose à elle-même par pliage sur cet axe",
          explication: "On peut vérifier un axe de symétrie en pliant la figure : les deux moitiés doivent se superposer exactement."
        },
        {
          id: "6sy05",
          difficulte: 2,
          enonce: "Combien d'axes de symétrie possède un cercle ?",
          type: "qcm",
          choix: ["Une infinité", "1", "4", "2"],
          reponse: "Une infinité",
          explication: "Tout diamètre d'un cercle est un axe de symétrie. Il y a une infinité de diamètres, donc une infinité d'axes."
        },
        {
          id: "6sy06",
          difficulte: 2,
          enonce: "Le symétrique du point A(2 ; 3) par rapport à l'axe des abscisses (axe x) est :",
          type: "qcm",
          choix: ["A'(2 ; -3)", "A'(-2 ; 3)", "A'(-2 ; -3)", "A'(3 ; 2)"],
          reponse: "A'(2 ; -3)",
          explication: "La symétrie par rapport à l'axe des abscisses conserve l'abscisse et change le signe de l'ordonnée."
        },
        {
          id: "6sy07",
          difficulte: 2,
          enonce: "Un triangle équilatéral possède combien d'axes de symétrie ?",
          type: "qcm",
          choix: ["3", "1", "6", "0"],
          reponse: "3",
          explication: "Un triangle équilatéral a 3 axes de symétrie, passant chacun par un sommet et le milieu du côté opposé."
        },
        {
          id: "6sy08",
          difficulte: 2,
          enonce: "Pour construire le symétrique d'un point P par rapport à une droite d, on :",
          type: "qcm",
          choix: ["Trace la perpendiculaire de P à d, puis reporte la même distance de l'autre côté", "Trace une parallèle à d depuis P", "Trouve le milieu de P et d", "Trace un cercle de centre P"],
          reponse: "Trace la perpendiculaire de P à d, puis reporte la même distance de l'autre côté",
          explication: "Construction : 1) Tracer la perpendiculaire à d passant par P. 2) Mesurer la distance de P à d. 3) Reporter cette distance de l'autre côté."
        },
        {
          id: "6sy09",
          difficulte: 3,
          enonce: "Combien d'axes de symétrie possède un losange (non carré) ?",
          type: "qcm",
          choix: ["2", "4", "0", "1"],
          reponse: "2",
          explication: "Un losange a 2 axes de symétrie : ses deux diagonales."
        },
        {
          id: "6sy10",
          difficulte: 3,
          enonce: "La symétrie axiale conserve-t-elle les distances et les angles ?",
          type: "qcm",
          choix: ["Oui, c'est une isométrie", "Non, elle agrandit les distances", "Oui mais change les angles", "Non, elle change tout"],
          reponse: "Oui, c'est une isométrie",
          explication: "La symétrie axiale est une isométrie : elle conserve les distances, les angles, et les aires. Les figures sont congruentes."
        }
      ]
    },

    "Solides": {
      label: "Solides (cube, pavé droit, patrons)",
      icon: "🎲",
      color: "#78716c",
      questions: [
        {
          id: "6so01",
          difficulte: 1,
          enonce: "Un cube possède combien de faces ?",
          type: "qcm",
          choix: ["6", "4", "8", "12"],
          reponse: "6",
          explication: "Un cube a 6 faces carrées identiques, 12 arêtes et 8 sommets."
        },
        {
          id: "6so02",
          difficulte: 1,
          enonce: "Un pavé droit (boîte rectangulaire) possède combien de sommets ?",
          type: "qcm",
          choix: ["8", "6", "4", "12"],
          reponse: "8",
          explication: "Un pavé droit a 8 sommets (les coins), 12 arêtes et 6 faces rectangulaires."
        },
        {
          id: "6so03",
          difficulte: 1,
          enonce: "Le patron d'un solide est :",
          type: "qcm",
          choix: ["Un développement à plat du solide", "Une vue de dessus", "La liste des arêtes", "Un dessin en 3D"],
          reponse: "Un développement à plat du solide",
          explication: "Un patron est la représentation à plat qu'on obtient en 'découpant' et dépliant le solide."
        },
        {
          id: "6so04",
          difficulte: 1,
          enonce: "Un cube d'arête 4 cm a une aire totale de :",
          type: "qcm",
          choix: ["96 cm²", "64 cm²", "24 cm²", "48 cm²"],
          reponse: "96 cm²",
          explication: "6 faces carrées de 4 cm de côté. Aire totale = 6 × 4² = 6 × 16 = 96 cm²."
        },
        {
          id: "6so05",
          difficulte: 2,
          enonce: "Combien d'arêtes possède un pavé droit ?",
          type: "qcm",
          choix: ["12", "8", "6", "16"],
          reponse: "12",
          explication: "Un pavé droit (comme un cube) possède 12 arêtes : 4 longueurs, 4 largeurs, 4 hauteurs."
        },
        {
          id: "6so06",
          difficulte: 2,
          enonce: "Parmi ces patrons, lequel peut former un cube ? (Choisir la description correcte)",
          type: "qcm",
          choix: ["6 carrés identiques correctement disposés", "4 carrés en ligne", "5 carrés en croix", "6 rectangles"],
          reponse: "6 carrés identiques correctement disposés",
          explication: "Un cube a 6 faces carrées. Son patron doit contenir exactement 6 carrés identiques disposés de façon à pouvoir se replier sans chevauchement."
        },
        {
          id: "6so07",
          difficulte: 2,
          enonce: "Quelle est la différence entre un cube et un pavé droit ?",
          type: "qcm",
          choix: ["Le cube a toutes ses arêtes égales, pas le pavé", "Le pavé a plus de faces", "Le cube a des faces rondes", "Ils sont identiques"],
          reponse: "Le cube a toutes ses arêtes égales, pas le pavé",
          explication: "Le cube est un cas particulier de pavé droit où toutes les arêtes sont égales (longueur = largeur = hauteur)."
        },
        {
          id: "6so08",
          difficulte: 2,
          enonce: "L'aire latérale d'un pavé droit 6 × 4 × 3 cm (sans les bases haut et bas) est :",
          type: "qcm",
          choix: ["60 cm²", "72 cm²", "48 cm²", "24 cm²"],
          reponse: "60 cm²",
          explication: "Les 4 faces latérales : 2 faces (6×3) + 2 faces (4×3) = 36 + 24 = 60 cm²."
        },
        {
          id: "6so09",
          difficulte: 3,
          enonce: "Un solide a 5 faces, 8 arêtes et 5 sommets. C'est :",
          type: "qcm",
          choix: ["Une pyramide à base carrée", "Un cube", "Un prisme triangulaire", "Un cône"],
          reponse: "Une pyramide à base carrée",
          explication: "Pyramide à base carrée : 1 base carrée + 4 faces triangulaires = 5 faces, 4+4 = 8 arêtes, 4+1 = 5 sommets. Formule d'Euler : F + S − A = 2 : 5 + 5 − 8 = 2 ✓"
        },
        {
          id: "6so10",
          difficulte: 3,
          enonce: "Quelle formule relie faces (F), arêtes (A) et sommets (S) d'un polyèdre convexe ?",
          type: "qcm",
          choix: ["F + S − A = 2", "F + A − S = 2", "F × S = A", "F + S + A = 20"],
          reponse: "F + S − A = 2",
          explication: "C'est la formule d'Euler. Exemple pour un cube : 6 + 8 − 12 = 2 ✓"
        }
      ]
    }

  },

  // ══════════════════════════════════════════
  //  5ÈME
  // ══════════════════════════════════════════
  "5eme": {

    "Nombres et Calculs": {
      label: "Nombres et Calculs",
      icon: "🔢",
      color: "#4f46e5",
      questions: [
        {
          id: "5nc01",
          difficulte: 1,
          enonce: "Calcule : (-3) + (-7)",
          type: "qcm",
          choix: ["-10", "-4", "10", "4"],
          reponse: "-10",
          explication: "(-3) + (-7) = -(3+7) = -10. On additionne deux nombres négatifs : le résultat est négatif."
        },
        {
          id: "5nc02",
          difficulte: 1,
          enonce: "Quel est le résultat de (-5) × (+4) ?",
          type: "qcm",
          choix: ["-20", "20", "-9", "9"],
          reponse: "-20",
          explication: "Le produit d'un nombre négatif et d'un nombre positif est négatif. (-5) × 4 = -20."
        },
        {
          id: "5nc03",
          difficulte: 1,
          enonce: "Simplifie la fraction : 18/24",
          type: "qcm",
          choix: ["3/4", "2/3", "6/8", "9/12"],
          reponse: "3/4",
          explication: "PGCD(18, 24) = 6. On divise numérateur et dénominateur par 6 : 18÷6 = 3 et 24÷6 = 4. Fraction irréductible : 3/4."
        },
        {
          id: "5nc04",
          difficulte: 1,
          enonce: "Calcule : 3/4 + 1/3",
          type: "qcm",
          choix: ["13/12", "4/7", "1/2", "7/12"],
          reponse: "13/12",
          explication: "On réduit au même dénominateur (12) : 3/4 = 9/12 et 1/3 = 4/12. Donc 9/12 + 4/12 = 13/12."
        },
        {
          id: "5nc05",
          difficulte: 2,
          enonce: "Calcule : 2/3 × 3/5",
          type: "qcm",
          choix: ["2/5", "6/15", "5/9", "1/5"],
          reponse: "2/5",
          explication: "(2×3)/(3×5) = 6/15 = 2/5 après simplification par 3."
        },
        {
          id: "5nc06",
          difficulte: 2,
          enonce: "Quel nombre est opposé à -8 ?",
          type: "qcm",
          choix: ["8", "-8", "1/8", "-1/8"],
          reponse: "8",
          explication: "L'opposé d'un nombre est son symétrique par rapport à 0. L'opposé de -8 est +8."
        },
        {
          id: "5nc07",
          difficulte: 2,
          enonce: "Calcule : (-12) ÷ (-3)",
          type: "qcm",
          choix: ["4", "-4", "36", "-36"],
          reponse: "4",
          explication: "Le quotient de deux nombres de même signe est positif. (-12) ÷ (-3) = +4."
        },
        {
          id: "5nc08",
          difficulte: 2,
          enonce: "Écris 0,075 sous forme de fraction irréductible.",
          type: "qcm",
          choix: ["3/40", "75/100", "7/50", "3/4"],
          reponse: "3/40",
          explication: "0,075 = 75/1000. PGCD(75, 1000) = 25. Donc 75/1000 = 3/40."
        },
        {
          id: "5nc09",
          difficulte: 3,
          enonce: "Calcule : 5 - (-3)",
          type: "qcm",
          choix: ["8", "2", "-8", "-2"],
          reponse: "8",
          explication: "Soustraire un nombre négatif revient à l'additionner. 5 - (-3) = 5 + 3 = 8."
        },
        {
          id: "5nc10",
          difficulte: 3,
          enonce: "Quel est le PGCD de 36 et 48 ?",
          type: "qcm",
          choix: ["12", "6", "4", "3"],
          reponse: "12",
          explication: "36 = 2²×3² et 48 = 2⁴×3. Le PGCD prend le minimum de chaque exposant : 2²×3 = 12."
        }
      ]
    },

    "Proportionnalité": {
      label: "Proportionnalité",
      icon: "📐",
      color: "#0891b2",
      questions: [
        {
          id: "5pr01",
          difficulte: 1,
          enonce: "Si 3 stylos coûtent 4,50 €, combien coûtent 5 stylos ?",
          type: "qcm",
          choix: ["7,50 €", "6,00 €", "9,00 €", "8,50 €"],
          reponse: "7,50 €",
          explication: "Prix unitaire : 4,50 ÷ 3 = 1,50 €. Pour 5 stylos : 5 × 1,50 = 7,50 €."
        },
        {
          id: "5pr02",
          difficulte: 1,
          enonce: "Un tableau de proportionnalité : si 2 correspond à 7, que vaut x correspondant à 6 ?",
          type: "qcm",
          choix: ["21", "14", "3", "9"],
          reponse: "21",
          explication: "Coefficient de proportionnalité : 7/2 = 3,5. Pour 6 : 6 × 3,5 = 21."
        },
        {
          id: "5pr03",
          difficulte: 1,
          enonce: "Sur une carte à l'échelle 1/50 000, une distance mesure 4 cm. Quelle est la distance réelle ?",
          type: "qcm",
          choix: ["2 km", "4 km", "20 km", "200 km"],
          reponse: "2 km",
          explication: "Distance réelle = 4 × 50 000 = 200 000 cm = 2 000 m = 2 km."
        },
        {
          id: "5pr04",
          difficulte: 1,
          enonce: "Un article coûte 80 €. Il est en promotion à -25%. Quel est son nouveau prix ?",
          type: "qcm",
          choix: ["60 €", "55 €", "65 €", "70 €"],
          reponse: "60 €",
          explication: "Réduction : 80 × 0,25 = 20 €. Prix final : 80 - 20 = 60 €."
        },
        {
          id: "5pr05",
          difficulte: 2,
          enonce: "Est-ce que 3/4 et 9/12 sont proportionnels ? (produits croisés)",
          type: "qcm",
          choix: ["Oui, 3×12 = 4×9", "Non, 3×9 ≠ 4×12", "Oui, 3+9 = 4+8", "Non, les fractions sont différentes"],
          reponse: "Oui, 3×12 = 4×9",
          explication: "Produits croisés : 3×12 = 36 et 4×9 = 36. Les produits sont égaux donc les fractions sont égales."
        },
        {
          id: "5pr06",
          difficulte: 2,
          enonce: "Un vélo roule à 15 km/h pendant 2 h 30 min. Quelle distance parcourt-il ?",
          type: "qcm",
          choix: ["37,5 km", "30 km", "45 km", "35 km"],
          reponse: "37,5 km",
          explication: "2h30min = 2,5 h. Distance = vitesse × temps = 15 × 2,5 = 37,5 km."
        },
        {
          id: "5pr07",
          difficulte: 2,
          enonce: "Une recette pour 4 personnes nécessite 300 g de farine. Combien pour 6 personnes ?",
          type: "qcm",
          choix: ["450 g", "400 g", "500 g", "350 g"],
          reponse: "450 g",
          explication: "Coefficient : 6/4 = 1,5. Farine nécessaire : 300 × 1,5 = 450 g."
        },
        {
          id: "5pr08",
          difficulte: 2,
          enonce: "Un graphique montre une droite passant par l'origine. Cela signifie que les grandeurs sont :",
          type: "qcm",
          choix: ["Proportionnelles", "Inversement proportionnelles", "Indépendantes", "Égales"],
          reponse: "Proportionnelles",
          explication: "Deux grandeurs sont proportionnelles si et seulement si leur graphique est une droite passant par l'origine."
        },
        {
          id: "5pr09",
          difficulte: 3,
          enonce: "Une population augmente de 10% par an. Elle est aujourd'hui de 1000 habitants. Combien dans 1 an ?",
          type: "qcm",
          choix: ["1100", "1010", "1200", "1050"],
          reponse: "1100",
          explication: "Augmentation de 10% : 1000 × 1,10 = 1100 habitants."
        },
        {
          id: "5pr10",
          difficulte: 3,
          enonce: "Si 8 ouvriers fabriquent 240 pièces en un jour, combien en fabriquent 3 ouvriers au même rythme ?",
          type: "qcm",
          choix: ["90", "80", "60", "120"],
          reponse: "90",
          explication: "Pièces par ouvrier : 240 ÷ 8 = 30. Pour 3 ouvriers : 30 × 3 = 90 pièces."
        }
      ]
    },

    "Géométrie": {
      label: "Géométrie",
      icon: "📏",
      color: "#059669",
      questions: [
        {
          id: "5ge01",
          difficulte: 1,
          enonce: "Quelle est la valeur de l'angle manquant dans un triangle ayant des angles de 60° et 70° ?",
          type: "qcm",
          choix: ["50°", "60°", "70°", "80°"],
          reponse: "50°",
          explication: "La somme des angles d'un triangle est 180°. Angle manquant = 180 - 60 - 70 = 50°."
        },
        {
          id: "5ge02",
          difficulte: 1,
          enonce: "Dans un triangle rectangle, l'hypoténuse mesure 10 cm et un côté 6 cm. Quel est le troisième côté ?",
          type: "qcm",
          choix: ["8 cm", "7 cm", "4 cm", "9 cm"],
          reponse: "8 cm",
          explication: "Théorème de Pythagore : a² + b² = c². 6² + b² = 10². 36 + b² = 100. b² = 64. b = 8 cm."
        },
        {
          id: "5ge03",
          difficulte: 1,
          enonce: "Un parallélogramme a une base de 8 cm et une hauteur de 5 cm. Quelle est son aire ?",
          type: "qcm",
          choix: ["40 cm²", "26 cm²", "20 cm²", "13 cm²"],
          reponse: "40 cm²",
          explication: "Aire d'un parallélogramme = base × hauteur = 8 × 5 = 40 cm²."
        },
        {
          id: "5ge04",
          difficulte: 1,
          enonce: "Quel est le volume d'un cube d'arête 4 cm ?",
          type: "qcm",
          choix: ["64 cm³", "16 cm³", "48 cm³", "96 cm³"],
          reponse: "64 cm³",
          explication: "Volume d'un cube = arête³ = 4³ = 4 × 4 × 4 = 64 cm³."
        },
        {
          id: "5ge05",
          difficulte: 2,
          enonce: "Deux droites perpendiculaires forment un angle de :",
          type: "qcm",
          choix: ["90°", "45°", "180°", "60°"],
          reponse: "90°",
          explication: "Par définition, deux droites perpendiculaires sont celles qui se coupent en formant un angle droit de 90°."
        },
        {
          id: "5ge06",
          difficulte: 2,
          enonce: "Le périmètre d'un cercle de rayon 5 cm est (prendre π ≈ 3,14) :",
          type: "qcm",
          choix: ["31,4 cm", "78,5 cm", "15,7 cm", "25 cm"],
          reponse: "31,4 cm",
          explication: "Périmètre = 2πr = 2 × 3,14 × 5 = 31,4 cm."
        },
        {
          id: "5ge07",
          difficulte: 2,
          enonce: "Dans un triangle, si deux angles mesurent 90° et 45°, le triangle est :",
          type: "qcm",
          choix: ["Rectangle isocèle", "Équilatéral", "Obtusangle", "Scalène quelconque"],
          reponse: "Rectangle isocèle",
          explication: "3ème angle = 180 - 90 - 45 = 45°. Deux angles égaux (45°) → isocèle. Un angle de 90° → rectangle."
        },
        {
          id: "5ge08",
          difficulte: 2,
          enonce: "Quelle est l'aire d'un disque de rayon 3 cm ? (π ≈ 3,14)",
          type: "qcm",
          choix: ["28,26 cm²", "18,84 cm²", "9,42 cm²", "6 cm²"],
          reponse: "28,26 cm²",
          explication: "Aire = π × r² = 3,14 × 3² = 3,14 × 9 = 28,26 cm²."
        },
        {
          id: "5ge09",
          difficulte: 3,
          enonce: "Un prisme droit à base rectangulaire (longueur 5, largeur 3, hauteur 4) a un volume de :",
          type: "qcm",
          choix: ["60 cm³", "94 cm³", "20 cm³", "45 cm³"],
          reponse: "60 cm³",
          explication: "Volume = Aire de la base × hauteur = (5 × 3) × 4 = 15 × 4 = 60 cm³."
        },
        {
          id: "5ge10",
          difficulte: 3,
          enonce: "Si deux triangles sont semblables avec un rapport de 2, et que le petit a un périmètre de 15 cm, quel est le périmètre du grand ?",
          type: "qcm",
          choix: ["30 cm", "45 cm", "60 cm", "20 cm"],
          reponse: "30 cm",
          explication: "Les périmètres sont dans le même rapport que les longueurs. Grand périmètre = 15 × 2 = 30 cm."
        }
      ]
    },

    "Algèbre": {
      label: "Algèbre et Calcul littéral",
      icon: "🔣",
      color: "#dc2626",
      questions: [
        {
          id: "5al01",
          difficulte: 1,
          enonce: "Développe : 3(x + 4)",
          type: "qcm",
          choix: ["3x + 12", "3x + 4", "x + 12", "3x + 7"],
          reponse: "3x + 12",
          explication: "On distribue le 3 : 3 × x + 3 × 4 = 3x + 12."
        },
        {
          id: "5al02",
          difficulte: 1,
          enonce: "Calcule l'expression 2x - 5 pour x = 3",
          type: "qcm",
          choix: ["1", "11", "-1", "6"],
          reponse: "1",
          explication: "On substitue x par 3 : 2×3 - 5 = 6 - 5 = 1."
        },
        {
          id: "5al03",
          difficulte: 1,
          enonce: "Résous l'équation : x + 7 = 15",
          type: "qcm",
          choix: ["x = 8", "x = 22", "x = -8", "x = 7"],
          reponse: "x = 8",
          explication: "On soustrait 7 des deux membres : x = 15 - 7 = 8."
        },
        {
          id: "5al04",
          difficulte: 1,
          enonce: "Résous l'équation : 3x = 21",
          type: "qcm",
          choix: ["x = 7", "x = 63", "x = 18", "x = 3"],
          reponse: "x = 7",
          explication: "On divise les deux membres par 3 : x = 21 ÷ 3 = 7."
        },
        {
          id: "5al05",
          difficulte: 2,
          enonce: "Réduis l'expression : 4x + 3 + 2x - 1",
          type: "qcm",
          choix: ["6x + 2", "6x - 2", "8x + 2", "6x + 4"],
          reponse: "6x + 2",
          explication: "On regroupe les termes en x : 4x + 2x = 6x. Puis les constantes : 3 - 1 = 2. Résultat : 6x + 2."
        },
        {
          id: "5al06",
          difficulte: 2,
          enonce: "Quel est le périmètre d'un rectangle de longueur (2x+1) et largeur 3 ?",
          type: "qcm",
          choix: ["4x + 8", "6x + 3", "2x + 4", "4x + 2"],
          reponse: "4x + 8",
          explication: "P = 2 × (longueur + largeur) = 2 × (2x+1+3) = 2 × (2x+4) = 4x + 8."
        },
        {
          id: "5al07",
          difficulte: 2,
          enonce: "Développe et réduis : 2(3x - 1) + x",
          type: "qcm",
          choix: ["7x - 2", "6x - 1", "7x - 1", "5x - 2"],
          reponse: "7x - 2",
          explication: "2(3x - 1) + x = 6x - 2 + x = 7x - 2."
        },
        {
          id: "5al08",
          difficulte: 2,
          enonce: "Résous : 2x - 3 = 7",
          type: "qcm",
          choix: ["x = 5", "x = 2", "x = 10", "x = -2"],
          reponse: "x = 5",
          explication: "2x = 7 + 3 = 10. x = 10 ÷ 2 = 5."
        },
        {
          id: "5al09",
          difficulte: 3,
          enonce: "Factorise : 6x + 9",
          type: "qcm",
          choix: ["3(2x + 3)", "6(x + 3)", "3(2x + 9)", "9(x + 1)"],
          reponse: "3(2x + 3)",
          explication: "Le facteur commun de 6x et 9 est 3. Donc 6x + 9 = 3(2x + 3)."
        },
        {
          id: "5al10",
          difficulte: 3,
          enonce: "Traduis en équation : 'Le triple d'un nombre augmenté de 4 vaut 19'",
          type: "qcm",
          choix: ["3x + 4 = 19", "3x - 4 = 19", "x + 4 = 19", "3(x + 4) = 19"],
          reponse: "3x + 4 = 19",
          explication: "Triple = ×3, augmenté de 4 = +4. Équation : 3x + 4 = 19."
        }
      ]
    },

    "Statistiques": {
      label: "Statistiques et Probabilités",
      icon: "📊",
      color: "#7c3aed",
      questions: [
        {
          id: "5st01",
          difficulte: 1,
          enonce: "Voici des notes : 8, 12, 15, 10, 15. Quelle est la moyenne ?",
          type: "qcm",
          choix: ["12", "15", "10", "11"],
          reponse: "12",
          explication: "Moyenne = (8+12+15+10+15) ÷ 5 = 60 ÷ 5 = 12."
        },
        {
          id: "5st02",
          difficulte: 1,
          enonce: "Voici des valeurs : 3, 7, 7, 9, 11. Quelle est la médiane ?",
          type: "qcm",
          choix: ["7", "9", "3", "11"],
          reponse: "7",
          explication: "Série ordonnée : 3, 7, 7, 9, 11. La médiane est la valeur centrale : la 3ème = 7."
        },
        {
          id: "5st03",
          difficulte: 1,
          enonce: "On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un 4 ?",
          type: "qcm",
          choix: ["1/6", "1/4", "4/6", "1/3"],
          reponse: "1/6",
          explication: "Il y a 6 issues équiprobables et 1 seule favorable (le 4). P(4) = 1/6."
        },
        {
          id: "5st04",
          difficulte: 1,
          enonce: "Dans un sac : 3 billes rouges, 2 bleues, 5 vertes. On tire une bille. P(rouge) = ?",
          type: "qcm",
          choix: ["3/10", "1/3", "3/5", "1/5"],
          reponse: "3/10",
          explication: "Total = 10 billes. Issues favorables = 3 (rouges). P(rouge) = 3/10."
        },
        {
          id: "5st05",
          difficulte: 2,
          enonce: "Un diagramme circulaire représente 100 élèves. Un secteur couvre 72°. Combien d'élèves représente-t-il ?",
          type: "qcm",
          choix: ["20", "72", "36", "18"],
          reponse: "20",
          explication: "Proportion : 72/360 = 1/5. Nombre d'élèves : 100 × (1/5) = 20."
        },
        {
          id: "5st06",
          difficulte: 2,
          enonce: "Quelle est l'étendue de la série : 4, 9, 2, 15, 7 ?",
          type: "qcm",
          choix: ["13", "11", "15", "7"],
          reponse: "13",
          explication: "Étendue = maximum - minimum = 15 - 2 = 13."
        },
        {
          id: "5st07",
          difficulte: 2,
          enonce: "On lance une pièce de monnaie équilibrée. P(pile) = ?",
          type: "qcm",
          choix: ["1/2", "1/4", "1", "0"],
          reponse: "1/2",
          explication: "Il y a 2 issues équiprobables. La probabilité d'obtenir pile est 1/2."
        },
        {
          id: "5st08",
          difficulte: 2,
          enonce: "Une valeur impossible a une probabilité de :",
          type: "qcm",
          choix: ["0", "1", "0,5", "-1"],
          reponse: "0",
          explication: "Une probabilité est toujours comprise entre 0 (impossible) et 1 (certain)."
        },
        {
          id: "5st09",
          difficulte: 3,
          enonce: "Le mode de la série 3, 5, 5, 8, 9, 5, 2 est :",
          type: "qcm",
          choix: ["5", "3", "8", "9"],
          reponse: "5",
          explication: "Le mode est la valeur la plus fréquente. 5 apparaît 3 fois, c'est le mode."
        },
        {
          id: "5st10",
          difficulte: 3,
          enonce: "Un événement certain a une probabilité de :",
          type: "qcm",
          choix: ["1", "0", "0,5", "2"],
          reponse: "1",
          explication: "Un événement certain se produit à tous les coups. Sa probabilité est 1."
        }
      ]
    }
  },

  // ══════════════════════════════════════════
  //  4ÈME
  // ══════════════════════════════════════════
  "4eme": {

    "Nombres et Calculs": {
      label: "Puissances et Calcul",
      icon: "🔢",
      color: "#4f46e5",
      questions: [
        {
          id: "4nc01",
          difficulte: 1,
          enonce: "Calcule : 2⁵",
          type: "qcm",
          choix: ["32", "10", "25", "64"],
          reponse: "32",
          explication: "2⁵ = 2×2×2×2×2 = 32."
        },
        {
          id: "4nc02",
          difficulte: 1,
          enonce: "Quel est le résultat de 3⁻² ?",
          type: "qcm",
          choix: ["1/9", "-9", "-6", "1/6"],
          reponse: "1/9",
          explication: "Par définition, a⁻ⁿ = 1/aⁿ. Donc 3⁻² = 1/3² = 1/9."
        },
        {
          id: "4nc03",
          difficulte: 1,
          enonce: "Écris 0,00045 en notation scientifique.",
          type: "qcm",
          choix: ["4,5 × 10⁻⁴", "4,5 × 10⁴", "45 × 10⁻⁵", "0,45 × 10⁻³"],
          reponse: "4,5 × 10⁻⁴",
          explication: "On place la virgule après le premier chiffre significatif : 4,5. La virgule a reculé de 4 rangs → exposant -4."
        },
        {
          id: "4nc04",
          difficulte: 1,
          enonce: "Simplifie : 2⁴ × 2³",
          type: "qcm",
          choix: ["2⁷", "2¹²", "4⁷", "2¹"],
          reponse: "2⁷",
          explication: "aᵐ × aⁿ = aᵐ⁺ⁿ. Donc 2⁴ × 2³ = 2⁴⁺³ = 2⁷."
        },
        {
          id: "4nc05",
          difficulte: 2,
          enonce: "Calcule : 10³ × 10⁻¹",
          type: "qcm",
          choix: ["10²", "10⁴", "10⁻³", "1"],
          reponse: "10²",
          explication: "10³ × 10⁻¹ = 10³⁺⁽⁻¹⁾ = 10² = 100."
        },
        {
          id: "4nc06",
          difficulte: 2,
          enonce: "Simplifie : (5²)³",
          type: "qcm",
          choix: ["5⁶", "5⁵", "5⁸", "25³"],
          reponse: "5⁶",
          explication: "(aᵐ)ⁿ = aᵐˣⁿ. Donc (5²)³ = 5²ˣ³ = 5⁶."
        },
        {
          id: "4nc07",
          difficulte: 2,
          enonce: "Quel est l'ordre de grandeur de 4 878 km ?",
          type: "qcm",
          choix: ["5 × 10³ km", "4,878 × 10² km", "5 × 10⁴ km", "5 × 10² km"],
          reponse: "5 × 10³ km",
          explication: "4878 ≈ 5000 = 5 × 10³. L'ordre de grandeur est la puissance de 10 la plus proche."
        },
        {
          id: "4nc08",
          difficulte: 2,
          enonce: "Calcule : 6⁰",
          type: "qcm",
          choix: ["1", "0", "6", "indéfini"],
          reponse: "1",
          explication: "Tout nombre non nul élevé à la puissance 0 vaut 1. 6⁰ = 1."
        },
        {
          id: "4nc09",
          difficulte: 3,
          enonce: "Quel est le résultat de 10⁶ ÷ 10⁴ ?",
          type: "qcm",
          choix: ["10²", "10¹⁰", "10⁻²", "100"],
          reponse: "10²",
          explication: "aᵐ ÷ aⁿ = aᵐ⁻ⁿ. Donc 10⁶ ÷ 10⁴ = 10⁶⁻⁴ = 10² = 100."
        },
        {
          id: "4nc10",
          difficulte: 3,
          enonce: "Exprime 3 700 000 en notation scientifique.",
          type: "qcm",
          choix: ["3,7 × 10⁶", "37 × 10⁵", "3,7 × 10⁷", "0,37 × 10⁷"],
          reponse: "3,7 × 10⁶",
          explication: "On place la virgule après 3 : 3,7. La virgule a avancé de 6 rangs → exposant +6."
        }
      ]
    },

    "Proportionnalité": {
      label: "Proportionnalité avancée",
      icon: "📐",
      color: "#0891b2",
      questions: [
        {
          id: "4pr01",
          difficulte: 1,
          enonce: "Un article est soldé à -30%. Son prix initial est 120 €. Quel est le prix soldé ?",
          type: "qcm",
          choix: ["84 €", "90 €", "96 €", "78 €"],
          reponse: "84 €",
          explication: "Coefficient multiplicateur : 1 - 0,30 = 0,70. Prix soldé = 120 × 0,70 = 84 €."
        },
        {
          id: "4pr02",
          difficulte: 1,
          enonce: "Un capital de 500 € est placé à 4% par an. Intérêt après 1 an ?",
          type: "qcm",
          choix: ["20 €", "40 €", "50 €", "4 €"],
          reponse: "20 €",
          explication: "Intérêt = Capital × taux = 500 × 0,04 = 20 €."
        },
        {
          id: "4pr03",
          difficulte: 1,
          enonce: "Deux grandeurs ont le tableau : x: 2, 5, 8 / y: 6, 15, 24. Sont-elles proportionnelles ?",
          type: "qcm",
          choix: ["Oui, coefficient 3", "Non", "Oui, coefficient 2", "On ne peut pas savoir"],
          reponse: "Oui, coefficient 3",
          explication: "6/2 = 3, 15/5 = 3, 24/8 = 3. Le coefficient est constant (=3), donc proportionnalité."
        },
        {
          id: "4pr04",
          difficulte: 1,
          enonce: "Le taux de TVA est 20%. Un objet coûte 60 € HT. Son prix TTC est :",
          type: "qcm",
          choix: ["72 €", "80 €", "66 €", "70 €"],
          reponse: "72 €",
          explication: "Prix TTC = Prix HT × 1,20 = 60 × 1,20 = 72 €."
        },
        {
          id: "4pr05",
          difficulte: 2,
          enonce: "Dans un triangle, une droite parallèle à la base coupe les côtés selon le théorème de Thalès : AB = 12, AD = 8, AC = 9. AE = ?",
          type: "qcm",
          choix: ["6", "3", "12", "4"],
          reponse: "6",
          explication: "Par Thalès : AD/AB = AE/AC. 8/12 = AE/9. AE = 9 × 8/12 = 6."
        },
        {
          id: "4pr06",
          difficulte: 2,
          enonce: "Un prix augmente de 10% puis encore de 10%. L'augmentation totale est-elle de 20% ?",
          type: "qcm",
          choix: ["Non, c'est 21%", "Oui, exactement 20%", "Non, c'est 22%", "Non, c'est 19%"],
          reponse: "Non, c'est 21%",
          explication: "Coefficient : 1,10 × 1,10 = 1,21. L'augmentation totale est de 21%, pas 20%."
        },
        {
          id: "4pr07",
          difficulte: 2,
          enonce: "La vitesse d'un train est 270 km/h. En combien de minutes parcourt-il 90 km ?",
          type: "qcm",
          choix: ["20 min", "30 min", "15 min", "45 min"],
          reponse: "20 min",
          explication: "Temps = distance ÷ vitesse = 90/270 h = 1/3 h = 20 minutes."
        },
        {
          id: "4pr08",
          difficulte: 2,
          enonce: "Un meuble mesure 1,5 m. Sur un plan à l'échelle 1/50, il mesure :",
          type: "qcm",
          choix: ["3 cm", "30 cm", "0,3 cm", "15 cm"],
          reponse: "3 cm",
          explication: "1,5 m = 150 cm. Mesure sur plan : 150 ÷ 50 = 3 cm."
        },
        {
          id: "4pr09",
          difficulte: 3,
          enonce: "Suite au théorème de Thalès, si DE // BC, DB = 4, AD = 6, AE = 9, EC = ?",
          type: "qcm",
          choix: ["6", "4", "8", "3"],
          reponse: "6",
          explication: "AD/DB = AE/EC. 6/4 = 9/EC. EC = 9 × 4/6 = 6."
        },
        {
          id: "4pr10",
          difficulte: 3,
          enonce: "Une voiture consomme 6L aux 100 km. Combien consomme-t-elle pour 350 km ?",
          type: "qcm",
          choix: ["21 L", "18 L", "24 L", "20 L"],
          reponse: "21 L",
          explication: "Consommation = (6 × 350) ÷ 100 = 2100 ÷ 100 = 21 L."
        }
      ]
    },

    "Géométrie": {
      label: "Géométrie - Thalès & Pythagore",
      icon: "📏",
      color: "#059669",
      questions: [
        {
          id: "4ge01",
          difficulte: 1,
          enonce: "Dans un triangle rectangle, les côtés de l'angle droit mesurent 5 et 12. L'hypoténuse est :",
          type: "qcm",
          choix: ["13", "17", "11", "7"],
          reponse: "13",
          explication: "5² + 12² = 25 + 144 = 169 = 13². L'hypoténuse vaut 13."
        },
        {
          id: "4ge02",
          difficulte: 1,
          enonce: "La réciproque du théorème de Pythagore permet de :",
          type: "qcm",
          choix: ["Vérifier qu'un triangle est rectangle", "Calculer une hypoténuse", "Trouver un angle", "Calculer une aire"],
          reponse: "Vérifier qu'un triangle est rectangle",
          explication: "Si a² + b² = c², alors le triangle est rectangle en C. C'est la réciproque du théorème de Pythagore."
        },
        {
          id: "4ge03",
          difficulte: 1,
          enonce: "Un triangle a des côtés 7, 24, 25. Est-il rectangle ?",
          type: "qcm",
          choix: ["Oui, car 7²+24²=25²", "Non", "On ne peut pas savoir", "Oui, car 7+24=31≠25"],
          reponse: "Oui, car 7²+24²=25²",
          explication: "7² + 24² = 49 + 576 = 625 = 25². Donc le triangle est rectangle (réciproque de Pythagore)."
        },
        {
          id: "4ge04",
          difficulte: 1,
          enonce: "Selon le théorème de Thalès, si DE // BC dans le triangle ABC, alors :",
          type: "qcm",
          choix: ["AD/AB = AE/AC = DE/BC", "AD/DB = AE/EC = BC/DE", "AD = AE et AB = AC", "DE = BC/2"],
          reponse: "AD/AB = AE/AC = DE/BC",
          explication: "C'est l'énoncé direct du théorème de Thalès dans un triangle."
        },
        {
          id: "4ge05",
          difficulte: 2,
          enonce: "L'aire d'un trapèze de bases 6 et 10, et de hauteur 4 est :",
          type: "qcm",
          choix: ["32 cm²", "40 cm²", "24 cm²", "16 cm²"],
          reponse: "32 cm²",
          explication: "Aire = (b₁ + b₂)/2 × h = (6+10)/2 × 4 = 8 × 4 = 32 cm²."
        },
        {
          id: "4ge06",
          difficulte: 2,
          enonce: "Quelle est la longueur de la médiane d'un triangle équilatéral de côté 6 cm ?",
          type: "qcm",
          choix: ["3√3 cm", "6 cm", "3 cm", "√3 cm"],
          reponse: "3√3 cm",
          explication: "La médiane d'un triangle équilatéral = (côté × √3)/2 = 6√3/2 = 3√3 cm."
        },
        {
          id: "4ge07",
          difficulte: 2,
          enonce: "Volume d'un cylindre de rayon 3 cm et hauteur 5 cm ? (π ≈ 3,14)",
          type: "qcm",
          choix: ["141,3 cm³", "94,2 cm³", "47,1 cm³", "282,6 cm³"],
          reponse: "141,3 cm³",
          explication: "V = π × r² × h = 3,14 × 9 × 5 = 141,3 cm³."
        },
        {
          id: "4ge08",
          difficulte: 2,
          enonce: "Dans un triangle ABC, DE // BC avec AD = 4, AB = 6. Quel est le rapport DE/BC ?",
          type: "qcm",
          choix: ["2/3", "3/2", "4/6", "1/2"],
          reponse: "2/3",
          explication: "Par Thalès : DE/BC = AD/AB = 4/6 = 2/3."
        },
        {
          id: "4ge09",
          difficulte: 3,
          enonce: "Volume d'une pyramide à base carrée de côté 4 cm et hauteur 6 cm :",
          type: "qcm",
          choix: ["32 cm³", "48 cm³", "96 cm³", "16 cm³"],
          reponse: "32 cm³",
          explication: "V = (1/3) × base × hauteur = (1/3) × 16 × 6 = 32 cm³."
        },
        {
          id: "4ge10",
          difficulte: 3,
          enonce: "Un triangle a pour sommets A(0,0), B(4,0), C(0,3). Quelle est la longueur BC ?",
          type: "qcm",
          choix: ["5", "7", "4", "3"],
          reponse: "5",
          explication: "BC² = (4-0)² + (0-3)² = 16 + 9 = 25. BC = 5. (Triangle 3-4-5 rectangle)"
        }
      ]
    },

    "Algèbre": {
      label: "Algèbre - Développement & Factorisation",
      icon: "🔣",
      color: "#dc2626",
      questions: [
        {
          id: "4al01",
          difficulte: 1,
          enonce: "Développe : (x + 3)(x + 2)",
          type: "qcm",
          choix: ["x² + 5x + 6", "x² + 6x + 6", "x² + 5x + 5", "2x + 5"],
          reponse: "x² + 5x + 6",
          explication: "(x+3)(x+2) = x²+2x+3x+6 = x² + 5x + 6."
        },
        {
          id: "4al02",
          difficulte: 1,
          enonce: "Développe avec l'identité remarquable : (a + b)² = ?",
          type: "qcm",
          choix: ["a² + 2ab + b²", "a² + b²", "a² - 2ab + b²", "2a² + 2b²"],
          reponse: "a² + 2ab + b²",
          explication: "(a+b)² = a² + 2ab + b². C'est une identité remarquable fondamentale."
        },
        {
          id: "4al03",
          difficulte: 1,
          enonce: "Développe : (x - 4)²",
          type: "qcm",
          choix: ["x² - 8x + 16", "x² - 4x + 16", "x² + 16", "x² - 16"],
          reponse: "x² - 8x + 16",
          explication: "(x-4)² = x² - 2×4×x + 4² = x² - 8x + 16."
        },
        {
          id: "4al04",
          difficulte: 1,
          enonce: "Résous : 2(x - 3) = x + 4",
          type: "qcm",
          choix: ["x = 10", "x = 1", "x = 7", "x = -10"],
          reponse: "x = 10",
          explication: "2x - 6 = x + 4. 2x - x = 4 + 6. x = 10."
        },
        {
          id: "4al05",
          difficulte: 2,
          enonce: "Développe : (2x + 1)(x - 3)",
          type: "qcm",
          choix: ["2x² - 5x - 3", "2x² - 6x - 3", "2x² + 5x - 3", "2x² - 5x + 3"],
          reponse: "2x² - 5x - 3",
          explication: "(2x)(x) + (2x)(-3) + 1(x) + 1(-3) = 2x² - 6x + x - 3 = 2x² - 5x - 3."
        },
        {
          id: "4al06",
          difficulte: 2,
          enonce: "Factorise : x² - 9",
          type: "qcm",
          choix: ["(x-3)(x+3)", "(x-9)(x+1)", "(x-3)²", "x(x-9)"],
          reponse: "(x-3)(x+3)",
          explication: "x² - 9 = x² - 3² = (x-3)(x+3). Identité remarquable a²-b² = (a-b)(a+b)."
        },
        {
          id: "4al07",
          difficulte: 2,
          enonce: "Résous l'équation : x² = 25",
          type: "qcm",
          choix: ["x = 5 ou x = -5", "x = 5", "x = -5", "x = 12,5"],
          reponse: "x = 5 ou x = -5",
          explication: "x² = 25 → x = √25 = 5 ou x = -√25 = -5. Il y a deux solutions."
        },
        {
          id: "4al08",
          difficulte: 2,
          enonce: "Développe : (3 - x)²",
          type: "qcm",
          choix: ["9 - 6x + x²", "9 + x²", "9 - x²", "6x - x²"],
          reponse: "9 - 6x + x²",
          explication: "(3-x)² = 3² - 2×3×x + x² = 9 - 6x + x²."
        },
        {
          id: "4al09",
          difficulte: 3,
          enonce: "Factorise : 4x² - 1",
          type: "qcm",
          choix: ["(2x-1)(2x+1)", "(4x-1)(x+1)", "(2x-1)²", "4(x²-1)"],
          reponse: "(2x-1)(2x+1)",
          explication: "4x² - 1 = (2x)² - 1² = (2x-1)(2x+1). Différence de deux carrés."
        },
        {
          id: "4al10",
          difficulte: 3,
          enonce: "Résous : 3x + 5 = 2x - 1",
          type: "qcm",
          choix: ["x = -6", "x = 6", "x = -4", "x = 4"],
          reponse: "x = -6",
          explication: "3x - 2x = -1 - 5. x = -6."
        }
      ]
    },

    "Statistiques": {
      label: "Statistiques & Probabilités",
      icon: "📊",
      color: "#7c3aed",
      questions: [
        {
          id: "4st01",
          difficulte: 1,
          enonce: "Une série a pour valeurs 5, 8, 12, 8, 7. Quelle est la moyenne ?",
          type: "qcm",
          choix: ["8", "7", "10", "9"],
          reponse: "8",
          explication: "(5+8+12+8+7) ÷ 5 = 40 ÷ 5 = 8."
        },
        {
          id: "4st02",
          difficulte: 1,
          enonce: "On tire une carte au hasard dans un jeu de 32 cartes. P(as de cœur) = ?",
          type: "qcm",
          choix: ["3/4", "1/4", "7/8", "1/2"],
          reponse: "3/4",
          explication: "Il y a 8 cœurs sur 32. P(cœur) = 8/32 = 1/4. P(pas cœur) = 1 - 1/4 = 3/4."
        },
        {
          id: "4st03",
          difficulte: 1,
          enonce: "On lance 2 dés. Quelle est la probabilité d'obtenir une somme de 7 ?",
          type: "qcm",
          choix: ["6/36", "7/36", "5/36", "1/6"],
          reponse: "6/36",
          explication: "Couples donnant 7 : (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6 cas. Total 36. P = 6/36 = 1/6."
        },
        {
          id: "4st04",
          difficulte: 1,
          enonce: "Dans un tableau de fréquences, la fréquence d'une valeur est 0,25. Sur 200 observations, elle apparaît :",
          type: "qcm",
          choix: ["50 fois", "25 fois", "75 fois", "100 fois"],
          reponse: "50 fois",
          explication: "Effectif = fréquence × effectif total = 0,25 × 200 = 50."
        },
        {
          id: "4st05",
          difficulte: 2,
          enonce: "Quelle est la médiane de : 2, 4, 6, 8, 10, 12 ?",
          type: "qcm",
          choix: ["7", "6", "8", "5"],
          reponse: "7",
          explication: "6 valeurs → médiane entre 3ème et 4ème : (6+8)/2 = 7."
        },
        {
          id: "4st06",
          difficulte: 2,
          enonce: "Les événements A et B sont incompatibles. P(A) = 0,3. Que peut-on dire de P(B) ?",
          type: "qcm",
          choix: ["P(B) ≤ 0,7", "P(B) = 0,7", "P(B) = 0,3", "P(B) = 0"],
          reponse: "P(B) ≤ 0,7",
          explication: "Si A et B sont incompatibles : P(A∪B) = P(A)+P(B) ≤ 1, donc P(B) ≤ 1-0,3 = 0,7."
        },
        {
          id: "4st07",
          difficulte: 2,
          enonce: "On calcule la moyenne pondérée. Notes : 10 (coeff. 2), 14 (coeff. 3). La moyenne est :",
          type: "qcm",
          choix: ["12,4", "12", "13", "11,8"],
          reponse: "12,4",
          explication: "Moyenne = (10×2 + 14×3) ÷ (2+3) = (20+42) ÷ 5 = 62 ÷ 5 = 12,4."
        },
        {
          id: "4st08",
          difficulte: 2,
          enonce: "Un diagramme en boîte (boxplot) montre : Q1=5, médiane=8, Q3=12. L'écart interquartile est :",
          type: "qcm",
          choix: ["7", "4", "8", "3"],
          reponse: "7",
          explication: "Écart interquartile = Q3 - Q1 = 12 - 5 = 7."
        },
        {
          id: "4st09",
          difficulte: 3,
          enonce: "P(A) = 0,6. Quelle est la probabilité de l'événement contraire Ā ?",
          type: "qcm",
          choix: ["0,4", "0,6", "1,6", "0"],
          reponse: "0,4",
          explication: "P(Ā) = 1 - P(A) = 1 - 0,6 = 0,4."
        },
        {
          id: "4st10",
          difficulte: 3,
          enonce: "Sur 500 produits fabriqués, 15 sont défectueux. Fréquence des défauts en % :",
          type: "qcm",
          choix: ["3%", "1,5%", "5%", "0,3%"],
          reponse: "3%",
          explication: "Fréquence = 15/500 = 0,03 = 3%."
        }
      ]
    }
  },

  // ══════════════════════════════════════════
  //  3ÈME
  // ══════════════════════════════════════════
  "3eme": {

    "Nombres et Calculs": {
      label: "Racines & Calcul avancé",
      icon: "🔢",
      color: "#4f46e5",
      questions: [
        {
          id: "3nc01",
          difficulte: 1,
          enonce: "Calcule : √144",
          type: "qcm",
          choix: ["12", "14", "11", "72"],
          reponse: "12",
          explication: "√144 = 12 car 12² = 144."
        },
        {
          id: "3nc02",
          difficulte: 1,
          enonce: "Simplifie : √75",
          type: "qcm",
          choix: ["5√3", "3√5", "15√3", "√75"],
          reponse: "5√3",
          explication: "√75 = √(25×3) = √25 × √3 = 5√3."
        },
        {
          id: "3nc03",
          difficulte: 1,
          enonce: "Calcule : (√5)²",
          type: "qcm",
          choix: ["5", "25", "√10", "2√5"],
          reponse: "5",
          explication: "Par définition, (√a)² = a pour tout a ≥ 0. Donc (√5)² = 5."
        },
        {
          id: "3nc04",
          difficulte: 1,
          enonce: "Simplifie : √18 + √8",
          type: "qcm",
          choix: ["5√2", "√26", "6√2", "4√2"],
          reponse: "5√2",
          explication: "√18 = 3√2 et √8 = 2√2. Donc √18 + √8 = 3√2 + 2√2 = 5√2."
        },
        {
          id: "3nc05",
          difficulte: 2,
          enonce: "Quel est le nombre premier qui suit 17 ?",
          type: "qcm",
          choix: ["19", "18", "20", "21"],
          reponse: "19",
          explication: "18 = 2×9, 19 est premier (non divisible par 2,3,5,7). Donc le suivant est 19."
        },
        {
          id: "3nc06",
          difficulte: 2,
          enonce: "Calcule : √2 × √8",
          type: "qcm",
          choix: ["4", "√10", "2√2", "16"],
          reponse: "4",
          explication: "√2 × √8 = √(2×8) = √16 = 4."
        },
        {
          id: "3nc07",
          difficulte: 2,
          enonce: "Écris la décomposition en facteurs premiers de 360.",
          type: "qcm",
          choix: ["2³ × 3² × 5", "2² × 3³ × 5", "2⁴ × 3² × 5", "2³ × 3 × 5²"],
          reponse: "2³ × 3² × 5",
          explication: "360 = 2×180 = 2×2×90 = 4×90 = 8×45 = 8×9×5 = 2³×3²×5."
        },
        {
          id: "3nc08",
          difficulte: 2,
          enonce: "Quel est le PPCM de 4 et 6 ?",
          type: "qcm",
          choix: ["12", "24", "6", "4"],
          reponse: "12",
          explication: "4 = 2² et 6 = 2×3. PPCM = 2² × 3 = 12. C'est le plus petit multiple commun."
        },
        {
          id: "3nc09",
          difficulte: 3,
          enonce: "Simplifie : √50 / √2",
          type: "qcm",
          choix: ["5", "√25", "√48", "25"],
          reponse: "5",
          explication: "√50 / √2 = √(50/2) = √25 = 5."
        },
        {
          id: "3nc10",
          difficulte: 3,
          enonce: "Est-ce que √7 est un nombre rationnel ?",
          type: "qcm",
          choix: ["Non, c'est irrationnel", "Oui", "Oui, car 7 est entier", "On ne sait pas"],
          reponse: "Non, c'est irrationnel",
          explication: "√7 ne peut pas s'écrire sous forme p/q. C'est un nombre irrationnel."
        }
      ]
    },

    "Algèbre": {
      label: "Algèbre avancée & Équations",
      icon: "🔣",
      color: "#dc2626",
      questions: [
        {
          id: "3al01",
          difficulte: 1,
          enonce: "Résous le système : {x + y = 7 ; x - y = 3}",
          type: "qcm",
          choix: ["x=5, y=2", "x=2, y=5", "x=7, y=3", "x=4, y=3"],
          reponse: "x=5, y=2",
          explication: "Additionne : 2x = 10 → x = 5. Puis y = 7 - 5 = 2."
        },
        {
          id: "3al02",
          difficulte: 1,
          enonce: "Résous : {2x + y = 8 ; x - y = 1}",
          type: "qcm",
          choix: ["x=3, y=2", "x=2, y=4", "x=4, y=0", "x=1, y=6"],
          reponse: "x=3, y=2",
          explication: "Additionne : 3x = 9 → x = 3. Puis y = 8 - 2×3 = 2."
        },
        {
          id: "3al03",
          difficulte: 1,
          enonce: "Factorise complètement : 2x² + 4x",
          type: "qcm",
          choix: ["2x(x + 2)", "2(x² + 4)", "x(2x + 4)", "2x² + 4x"],
          reponse: "2x(x + 2)",
          explication: "Facteur commun : 2x. 2x² + 4x = 2x × x + 2x × 2 = 2x(x + 2)."
        },
        {
          id: "3al04",
          difficulte: 1,
          enonce: "Développe et réduis : (x + 2)² - (x - 2)²",
          type: "qcm",
          choix: ["8x", "4x", "8", "0"],
          reponse: "8x",
          explication: "(x+2)² = x²+4x+4. (x-2)² = x²-4x+4. Différence : 8x."
        },
        {
          id: "3al05",
          difficulte: 2,
          enonce: "Résous l'inéquation : 2x - 5 > 3",
          type: "qcm",
          choix: ["x > 4", "x > -1", "x < 4", "x > 1"],
          reponse: "x > 4",
          explication: "2x > 3 + 5. 2x > 8. x > 4."
        },
        {
          id: "3al06",
          difficulte: 2,
          enonce: "Une droite a pour équation y = 2x - 3. Que vaut y quand x = 4 ?",
          type: "qcm",
          choix: ["5", "11", "-3", "8"],
          reponse: "5",
          explication: "y = 2×4 - 3 = 8 - 3 = 5."
        },
        {
          id: "3al07",
          difficulte: 2,
          enonce: "Quelle est la pente de la droite passant par A(1,3) et B(4,9) ?",
          type: "qcm",
          choix: ["2", "3", "1/2", "6"],
          reponse: "2",
          explication: "Pente = (yB - yA)/(xB - xA) = (9-3)/(4-1) = 6/3 = 2."
        },
        {
          id: "3al08",
          difficulte: 2,
          enonce: "Résous : -3x < 12",
          type: "qcm",
          choix: ["x > -4", "x < -4", "x > 4", "x < 4"],
          reponse: "x > -4",
          explication: "On divise par -3 (attention, on inverse le signe !) : x > 12/(-3) = -4."
        },
        {
          id: "3al09",
          difficulte: 3,
          enonce: "Une droite a un coefficient directeur de 3 et passe par (0, -2). Son équation est :",
          type: "qcm",
          choix: ["y = 3x - 2", "y = -2x + 3", "y = 3x + 2", "y = -3x - 2"],
          reponse: "y = 3x - 2",
          explication: "Forme y = mx + p avec m = 3 (pente) et p = -2 (ordonnée à l'origine)."
        },
        {
          id: "3al10",
          difficulte: 3,
          enonce: "Résous le système par substitution : {y = 2x ; x + y = 9}",
          type: "qcm",
          choix: ["x=3, y=6", "x=4, y=5", "x=6, y=3", "x=9, y=0"],
          reponse: "x=3, y=6",
          explication: "On substitue y : x + 2x = 9. 3x = 9. x = 3. y = 2×3 = 6."
        }
      ]
    },

    "Géométrie": {
      label: "Géométrie dans l'espace & Trigo",
      icon: "📏",
      color: "#059669",
      questions: [
        {
          id: "3ge01",
          difficulte: 1,
          enonce: "Dans un triangle rectangle, sin(30°) = 0,5. L'hypoténuse vaut 10 cm. Le côté opposé à 30° vaut :",
          type: "qcm",
          choix: ["5 cm", "8,66 cm", "10 cm", "2 cm"],
          reponse: "5 cm",
          explication: "sin(30°) = côté opposé / hypoténuse. 0,5 = x/10. x = 5 cm."
        },
        {
          id: "3ge02",
          difficulte: 1,
          enonce: "Dans un triangle rectangle, tan(α) est défini comme :",
          type: "qcm",
          choix: ["côté opposé / côté adjacent", "côté adjacent / hypoténuse", "côté opposé / hypoténuse", "hypoténuse / côté adjacent"],
          reponse: "côté opposé / côté adjacent",
          explication: "tan(α) = côté opposé à α / côté adjacent à α. (Formule SOH-CAH-TOA : TOA)"
        },
        {
          id: "3ge03",
          difficulte: 1,
          enonce: "cos(60°) = 0,5. Dans un triangle rectangle avec une hypoténuse de 8 cm, le côté adjacent à 60° vaut :",
          type: "qcm",
          choix: ["4 cm", "6,93 cm", "8 cm", "2 cm"],
          reponse: "4 cm",
          explication: "cos(60°) = adjacent / hypoténuse. 0,5 = x/8. x = 4 cm."
        },
        {
          id: "3ge04",
          difficulte: 1,
          enonce: "Volume d'une sphère de rayon 3 cm ? (V = 4/3 × π × r³, π ≈ 3,14)",
          type: "qcm",
          choix: ["113,04 cm³", "37,68 cm³", "56,52 cm³", "339 cm³"],
          reponse: "113,04 cm³",
          explication: "V = 4/3 × 3,14 × 27 = 4/3 × 84,78 = 113,04 cm³."
        },
        {
          id: "3ge05",
          difficulte: 2,
          enonce: "Quel est l'angle dont le sinus vaut 1 ?",
          type: "qcm",
          choix: ["90°", "0°", "45°", "60°"],
          reponse: "90°",
          explication: "sin(90°) = 1. C'est la valeur maximale du sinus."
        },
        {
          id: "3ge06",
          difficulte: 2,
          enonce: "Volume d'un cône de rayon 4 cm et hauteur 9 cm ? (π ≈ 3,14)",
          type: "qcm",
          choix: ["150,72 cm³", "452,16 cm³", "200,96 cm³", "100,48 cm³"],
          reponse: "150,72 cm³",
          explication: "V = (1/3) × π × r² × h = (1/3) × 3,14 × 16 × 9 = (1/3) × 452,16 = 150,72 cm³."
        },
        {
          id: "3ge07",
          difficulte: 2,
          enonce: "Dans un triangle rectangle avec les cathètes 5 et 12, quelle est la valeur de sin de l'angle opposé à la cathète 5 ?",
          type: "qcm",
          choix: ["5/13", "12/13", "5/12", "12/5"],
          reponse: "5/13",
          explication: "Hypoténuse = 13 (triangle 5-12-13). sin(α) = opposé/hypoténuse = 5/13."
        },
        {
          id: "3ge08",
          difficulte: 2,
          enonce: "Aire latérale d'un cylindre de rayon 2 cm et hauteur 5 cm ? (π ≈ 3,14)",
          type: "qcm",
          choix: ["62,8 cm²", "31,4 cm²", "125,6 cm²", "20 cm²"],
          reponse: "62,8 cm²",
          explication: "Aire latérale = 2πrh = 2 × 3,14 × 2 × 5 = 62,8 cm²."
        },
        {
          id: "3ge09",
          difficulte: 3,
          enonce: "Deux triangles ont leurs angles égaux deux à deux. Ils sont :",
          type: "qcm",
          choix: ["Semblables", "Égaux", "Symétriques", "Homothétiques seulement"],
          reponse: "Semblables",
          explication: "Deux triangles sont semblables si leurs angles sont égaux deux à deux (critère AA)."
        },
        {
          id: "3ge10",
          difficulte: 3,
          enonce: "tan(45°) = ?",
          type: "qcm",
          choix: ["1", "0", "√2/2", "√3"],
          reponse: "1",
          explication: "tan(45°) = sin(45°)/cos(45°) = (√2/2)/(√2/2) = 1."
        }
      ]
    },

    "Proportionnalité": {
      label: "Fonctions & Proportionnalité",
      icon: "📐",
      color: "#0891b2",
      questions: [
        {
          id: "3pr01",
          difficulte: 1,
          enonce: "Quelle est l'image de 3 par la fonction f(x) = x² - 2x + 1 ?",
          type: "qcm",
          choix: ["4", "2", "6", "10"],
          reponse: "4",
          explication: "f(3) = 3² - 2×3 + 1 = 9 - 6 + 1 = 4."
        },
        {
          id: "3pr02",
          difficulte: 1,
          enonce: "La fonction f(x) = 2x + 3 est :",
          type: "qcm",
          choix: ["Affine", "Carrée", "Constante", "Inverse"],
          reponse: "Affine",
          explication: "Une fonction de la forme f(x) = ax + b est une fonction affine."
        },
        {
          id: "3pr03",
          difficulte: 1,
          enonce: "Le taux global d'évolution : hausse de 20% puis baisse de 20% donne :",
          type: "qcm",
          choix: ["-4%", "0%", "+4%", "-40%"],
          reponse: "-4%",
          explication: "Coefficient : 1,20 × 0,80 = 0,96. Évolution : 0,96 - 1 = -0,04 = -4%."
        },
        {
          id: "3pr04",
          difficulte: 1,
          enonce: "Quel est l'antécédent de 7 par f(x) = 3x - 2 ?",
          type: "qcm",
          choix: ["3", "5", "19", "2"],
          reponse: "3",
          explication: "On résout 3x - 2 = 7. 3x = 9. x = 3. L'antécédent est 3."
        },
        {
          id: "3pr05",
          difficulte: 2,
          enonce: "Une suite arithmétique commence par 5 avec une raison de 3. Quel est le 4ème terme ?",
          type: "qcm",
          choix: ["14", "12", "17", "20"],
          reponse: "14",
          explication: "u₁=5, u₂=8, u₃=11, u₄=14. Ou : u₄ = 5 + 3×(4-1) = 5 + 9 = 14."
        },
        {
          id: "3pr06",
          difficulte: 2,
          enonce: "Pour la fonction f(x) = x², f est croissante sur :",
          type: "qcm",
          choix: ["[0 ; +∞[", "]-∞ ; 0[", "ℝ entier", "]−∞ ; +∞["],
          reponse: "[0 ; +∞[",
          explication: "f(x) = x² est décroissante sur ]-∞;0] et croissante sur [0;+∞[."
        },
        {
          id: "3pr07",
          difficulte: 2,
          enonce: "Un capital de 1000 € est placé à 5% par an pendant 2 ans (intérêts composés). Il vaut :",
          type: "qcm",
          choix: ["1102,50 €", "1100 €", "1050 €", "1200 €"],
          reponse: "1102,50 €",
          explication: "Après 2 ans : 1000 × (1,05)² = 1000 × 1,1025 = 1102,50 €."
        },
        {
          id: "3pr08",
          difficulte: 2,
          enonce: "Quelle est la représentation graphique d'une fonction affine ?",
          type: "qcm",
          choix: ["Une droite", "Une parabole", "Un cercle", "Une courbe quelconque"],
          reponse: "Une droite",
          explication: "Toute fonction affine f(x) = ax + b a pour représentation graphique une droite."
        },
        {
          id: "3pr09",
          difficulte: 3,
          enonce: "On note f(x) = 1/x. Quel est f(4) ?",
          type: "qcm",
          choix: ["1/4", "4", "-4", "0,04"],
          reponse: "1/4",
          explication: "f(4) = 1/4. C'est la valeur de la fonction inverse en x=4."
        },
        {
          id: "3pr10",
          difficulte: 3,
          enonce: "Le taux de variation de f entre x=1 et x=3 pour f(x) = 2x+1 est :",
          type: "qcm",
          choix: ["2", "4", "1", "6"],
          reponse: "2",
          explication: "[f(3)-f(1)]/(3-1) = (7-3)/2 = 4/2 = 2. C'est le coefficient directeur."
        }
      ]
    },

    "Statistiques": {
      label: "Statistiques avancées",
      icon: "📊",
      color: "#7c3aed",
      questions: [
        {
          id: "3st01",
          difficulte: 1,
          enonce: "Quelle est la variance de la série : 2, 4, 4, 6 ? (moyenne = 4)",
          type: "qcm",
          choix: ["2", "4", "1", "8"],
          reponse: "2",
          explication: "Variance = [(2-4)²+(4-4)²+(4-4)²+(6-4)²]/4 = [4+0+0+4]/4 = 8/4 = 2."
        },
        {
          id: "3st02",
          difficulte: 1,
          enonce: "L'écart-type de la série précédente (variance = 2) est :",
          type: "qcm",
          choix: ["√2", "2", "4", "1"],
          reponse: "√2",
          explication: "Écart-type = √variance = √2 ≈ 1,41."
        },
        {
          id: "3st03",
          difficulte: 1,
          enonce: "On tire 2 boules d'un sac de 3 rouges et 2 bleues. P(2 rouges) = ?",
          type: "qcm",
          choix: ["3/10", "6/25", "9/25", "1/5"],
          reponse: "3/10",
          explication: "Avec un arbre ou combinaisons : C(3,2)/C(5,2) = 3/10."
        },
        {
          id: "3st04",
          difficulte: 1,
          enonce: "Un tableau croisé montre 200 élèves. 80 filles dont 50 aiment les maths. P(fille ∩ maths) = ?",
          type: "qcm",
          choix: ["0,25", "0,40", "0,50", "0,625"],
          reponse: "0,25",
          explication: "P(fille ∩ maths) = 50/200 = 0,25."
        },
        {
          id: "3st05",
          difficulte: 2,
          enonce: "Parmi 200 élèves, 80 sont filles et aiment les maths. P(aime maths | fille) = ?",
          type: "qcm",
          choix: ["0,625", "0,25", "0,40", "0,5"],
          reponse: "0,625",
          explication: "Probabilité conditionnelle : P(maths|fille) = P(maths∩fille)/P(fille) = 50/80 = 0,625."
        },
        {
          id: "3st06",
          difficulte: 2,
          enonce: "Quel indicateur mesure la dispersion d'une série ?",
          type: "qcm",
          choix: ["L'écart-type", "La moyenne", "La médiane", "Le mode"],
          reponse: "L'écart-type",
          explication: "L'écart-type (et la variance) mesurent la dispersion autour de la moyenne."
        },
        {
          id: "3st07",
          difficulte: 2,
          enonce: "Une urne contient 4 boules numérotées 1 à 4. On tire 2 fois avec remise. P(somme = 5) = ?",
          type: "qcm",
          choix: ["4/16", "3/16", "5/16", "2/16"],
          reponse: "4/16",
          explication: "Couples donnant 5 : (1,4),(2,3),(3,2),(4,1) = 4 cas sur 16. P = 4/16 = 1/4."
        },
        {
          id: "3st08",
          difficulte: 2,
          enonce: "Un échantillon est représentatif si :",
          type: "qcm",
          choix: ["Il a les mêmes caractéristiques que la population", "Il est grand", "Il est aléatoire uniquement", "Il est facile à constituer"],
          reponse: "Il a les mêmes caractéristiques que la population",
          explication: "Un échantillon représentatif reflète fidèlement les caractéristiques de la population étudiée."
        },
        {
          id: "3st09",
          difficulte: 3,
          enonce: "P(A) = 0,4, P(B) = 0,3, A et B indépendants. P(A et B) = ?",
          type: "qcm",
          choix: ["0,12", "0,7", "0,58", "0,1"],
          reponse: "0,12",
          explication: "Si A et B sont indépendants : P(A∩B) = P(A) × P(B) = 0,4 × 0,3 = 0,12."
        },
        {
          id: "3st10",
          difficulte: 3,
          enonce: "La loi des grands nombres nous dit que :",
          type: "qcm",
          choix: ["La fréquence tend vers la probabilité quand n → ∞", "Plus on essaie, plus on réussit", "La probabilité augmente après une série de pertes", "Tout événement finit par arriver"],
          reponse: "La fréquence tend vers la probabilité quand n → ∞",
          explication: "La loi des grands nombres : quand le nombre d'expériences augmente, la fréquence observée converge vers la probabilité théorique."
        }
      ]
    }
  }
};

// Métadonnées des niveaux
const NIVEAUX = {
  "6eme": { label: "6ème", emoji: "🟨", couleur: "#f59e0b" },
  "5eme": { label: "5ème", emoji: "🟦", couleur: "#4f46e5" },
  "4eme": { label: "4ème", emoji: "🟩", couleur: "#059669" },
  "3eme": { label: "3ème", emoji: "🟥", couleur: "#dc2626" }
};
