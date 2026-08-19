import type { EmGuideLocaleMap } from "./euromillions-guide-locales";

const playIt =
  "18+ · Gioco responsabile · Rischio di perdita. Aiuto: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.";
const playEs =
  "18+ · Juego responsable · Riesgo de pérdida. Ayuda: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.";
const playPt =
  "18+ · Jogo responsável · Risco de perda. Ajuda: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.";
const playDe =
  "18+ · Verantwortungsvoll spielen · Verlustrisiko. Hilfe: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.";
const playNl =
  "18+ · Speel verantwoord · Risico op verlies. Hulp: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.";

export const euromillionsCompanionGuideLocales: EmGuideLocaleMap = {
  "comprendre-loto": {
    it: {
      title: "Capire il Loto",
      subtitle:
        "5 numeri su 49, numero Chance, lettura di un risultato — senza alcun sistema promesso.",
      sections: [
        {
          heading: "Cos’è (e cosa non è) il Loto",
          paragraphs: [
            "Il Loto è una lotteria francese: una griglia combina 5 numeri su 49 e un numero Chance su 10. Un’estrazione pubblica seleziona poi la combinazione vincente. Le categorie dipendono da quanti numeri si indovinano e dal Chance.",
            "Questo sito è indipendente. Pubblichiamo risultati, archivi recenti, un simulatore e statistiche descrittive. Non vendiamo biglietti e non siamo FDJ.",
          ],
        },
        {
          heading: "Come si svolge un’estrazione",
          paragraphs: [
            "In pratica il Loto si estrae diverse sere a settimana (lunedì, mercoledì, sabato — orari indicativi, Europa/Parigi). Gli orari esatti spettano a FDJ.",
            "Dopo l’estrazione, fonti pubbliche pubblicano i 5 numeri, il Chance, a volte un jackpot. EuroMillions Risultati interroga queste fonti e mostra la scheda del giorno.",
          ],
        },
        {
          heading: "Leggere una scheda",
          paragraphs: [
            "Ogni scheda Loto mostra la data, i 5 numeri (crescenti) e il Chance. Il simulatore confronta una griglia con un’estrazione già pubblicata — non predice nulla.",
            "Le frequenze descrivono solo il passato dell’archivio locale. Un numero «in ritardo» non è più probabile alla prossima estrazione.",
          ],
        },
        {
          heading: "Jackpot e categorie",
          paragraphs: [
            "Il rango 1 (5 numeri + Chance) è rarissimo. Senza vincitore il jackpot è in genere riportato. Un importo annunciato non è una vincita personale.",
            "Solo l’operatore fa fede per un pagamento.",
          ],
        },
        {
          heading: "Simulatore e archivi",
          paragraphs: [
            "Sulla pagina Loto scegliete 5 numeri e un Chance, poi confrontate con l’estrazione scelta. Un contatore indica quante altre estrazioni locali condividono almeno 3 numeri.",
            "Gli archivi complementari sono più corti dello storico EuroMillions: l’API pubblica FDJ non risale al 2004. Conserviamo fino a 250 estrazioni.",
          ],
        },
        {
          heading: "Gioco responsabile",
          paragraphs: [
            "Per giocare: solo un operatore legale, maggiorenni (18+), budget per il tempo libero.",
            playIt,
          ],
        },
      ],
    },
    es: {
      title: "Entender el Loto",
      subtitle:
        "5 números de 49, número Chance, lectura de un resultado — sin ningún sistema prometido.",
      sections: [
        {
          heading: "Qué es (y qué no es) el Loto",
          paragraphs: [
            "El Loto es una lotería francesa: una combinación une 5 números de 49 y un número Chance de 10. Un sorteo público selecciona después la combinación ganadora.",
            "Este sitio es independiente. Publicamos resultados, archivos recientes, un simulador y estadísticas descriptivas. No vendemos boletos y no somos FDJ.",
          ],
        },
        {
          heading: "Cómo funciona un sorteo",
          paragraphs: [
            "En la práctica el Loto se sortea varias noches por semana (lunes, miércoles, sábado — horarios orientativos, Europa/París). Los horarios exactos los fija FDJ.",
            "Tras el sorteo, fuentes públicas publican los 5 números, el Chance, a veces un bote. EuroMillions Resultados consulta esas fuentes y muestra la ficha del día.",
          ],
        },
        {
          heading: "Leer una ficha",
          paragraphs: [
            "Cada ficha Loto muestra la fecha, los 5 números (ascendentes) y el Chance. El simulador compara una combinación con un sorteo ya publicado — no predice nada.",
            "Las frecuencias describen solo el pasado del archivo local. Un número «atrasado» no es más probable en el siguiente sorteo.",
          ],
        },
        {
          heading: "Bote y categorías",
          paragraphs: [
            "La categoría 1 (5 números + Chance) es rarísima. Sin ganador el bote suele reportarse. Un importe anunciado no es un premio personal.",
            "Solo el operador es válido para un pago.",
          ],
        },
        {
          heading: "Simulador y archivos",
          paragraphs: [
            "En la página Loto elija 5 números y un Chance, luego compare con el sorteo elegido. Un contador indica cuántos otros sorteos locales comparten al menos 3 números.",
            "Los archivos complementarios son más cortos que el historial EuroMillions. Conservamos hasta 250 sorteos.",
          ],
        },
        {
          heading: "Juego responsable",
          paragraphs: [
            "Para jugar: solo un operador legal, mayores de edad (18+), presupuesto de ocio.",
            playEs,
          ],
        },
      ],
    },
    pt: {
      title: "Compreender o Loto",
      subtitle:
        "5 números em 49, número Chance, leitura de um resultado — sem nenhum sistema prometido.",
      sections: [
        {
          heading: "O que é (e não é) o Loto",
          paragraphs: [
            "O Loto é uma lotaria francesa: uma grelha combina 5 números em 49 e um número Chance em 10. Um sorteio público escolhe depois a combinação vencedora.",
            "Este site é independente. Publicamos resultados, arquivos recentes, um simulador e estatísticas descritivas. Não vendemos bilhetes e não somos a FDJ.",
          ],
        },
        {
          heading: "Como decorre um sorteio",
          paragraphs: [
            "Na prática o Loto sai várias noites por semana (segunda, quarta, sábado — horários indicativos, Europa/Paris). Os horários exactos cabem à FDJ.",
            "Após o sorteio, fontes públicas publicam os 5 números, o Chance, por vezes um jackpot. EuroMillions Resultados consulta essas fontes e mostra a ficha do dia.",
          ],
        },
        {
          heading: "Ler uma ficha",
          paragraphs: [
            "Cada ficha Loto mostra a data, os 5 números (crescentes) e o Chance. O simulador compara uma grelha com um sorteio já publicado — não prevê nada.",
            "As frequências descrevem só o passado do arquivo local. Um número «em atraso» não é mais provável no próximo sorteio.",
          ],
        },
        {
          heading: "Jackpot e escalões",
          paragraphs: [
            "O 1.º escalão (5 números + Chance) é raríssimo. Sem vencedor o jackpot é em geral reportado. Um montante anunciado não é um prémio pessoal.",
            "Só o operador faz fé para um pagamento.",
          ],
        },
        {
          heading: "Simulador e arquivos",
          paragraphs: [
            "Na página Loto escolha 5 números e um Chance, depois compare com o sorteio escolhido. Um contador indica quantos outros sorteios locais partilham pelo menos 3 números.",
            "Os arquivos de acompanhamento são mais curtos do que o histórico EuroMillions. Conservamos até 250 sorteios.",
          ],
        },
        {
          heading: "Jogo responsável",
          paragraphs: [
            "Para jogar: só um operador legal, maiores (18+), orçamento de lazer.",
            playPt,
          ],
        },
      ],
    },
    de: {
      title: "Loto verstehen",
      subtitle:
        "5 Zahlen aus 49, Chance-Zahl, Ergebnis lesen — ohne versprochenes System.",
      sections: [
        {
          heading: "Was Loto ist (und nicht ist)",
          paragraphs: [
            "Loto ist eine französische Lotterie: Ein Tipp kombiniert 5 Zahlen aus 49 und eine Chance-Zahl aus 10. Eine öffentliche Ziehung bestimmt dann die Gewinnkombination.",
            "Diese Website ist unabhängig. Wir veröffentlichen Ergebnisse, aktuelle Archive, einen Simulator und beschreibende Statistiken. Wir verkaufen keine Tippscheine und sind nicht FDJ.",
          ],
        },
        {
          heading: "Ablauf einer Ziehung",
          paragraphs: [
            "In der Praxis wird Loto an mehreren Abenden pro Woche gezogen (Montag, Mittwoch, Samstag — Richtzeiten, Europa/Paris). Die genauen Zeiten legt FDJ fest.",
            "Nach der Ziehung veröffentlichen öffentliche Quellen die 5 Zahlen, die Chance, manchmal einen Jackpot. EuroMillions Ergebnisse fragt diese Quellen ab und zeigt die Tageskarte.",
          ],
        },
        {
          heading: "Eine Karte lesen",
          paragraphs: [
            "Jede Loto-Karte zeigt Datum, 5 Zahlen (aufsteigend) und Chance. Der Simulator vergleicht ein Grid mit einer bereits veröffentlichten Ziehung — er sagt nichts voraus.",
            "Häufigkeiten beschreiben nur die Vergangenheit des lokalen Archivs. Eine «überfällige» Zahl ist beim nächsten Mal nicht wahrscheinlicher.",
          ],
        },
        {
          heading: "Jackpot und Ränge",
          paragraphs: [
            "Rang 1 (5 Zahlen + Chance) ist extrem selten. Ohne Gewinner wird der Jackpot in der Regel übertragen. Ein angekündigter Betrag ist kein persönlicher Gewinn.",
            "Nur der Betreiber ist für eine Auszahlung maßgeblich.",
          ],
        },
        {
          heading: "Simulator und Ergebnisse",
          paragraphs: [
            "Auf der Loto-Seite wählen Sie 5 Zahlen und eine Chance, dann vergleichen Sie mit der gewählten Ziehung. Ein Zähler zeigt, wie viele andere lokale Ziehungen mindestens 3 Zahlen teilen.",
            "Die Begleitarchive sind kürzer als die EuroMillions-Historie. Wir behalten bis zu 250 Ziehungen.",
          ],
        },
        {
          heading: "Verantwortungsvolles Spiel",
          paragraphs: [
            "Zum Spielen: nur lizenzierter Betreiber, Volljährige (18+), Freizeitbudget.",
            playDe,
          ],
        },
      ],
    },
    nl: {
      title: "Loto begrijpen",
      subtitle:
        "5 nummers uit 49, Chance-nummer, een uitslag lezen — zonder beloofd systeem.",
      sections: [
        {
          heading: "Wat Loto is (en niet is)",
          paragraphs: [
            "Loto is een Franse loterij: een grid combineert 5 nummers uit 49 en een Chance-nummer uit 10. Een openbare trekking kiest daarna de winnende combinatie.",
            "Deze site is onafhankelijk. We publiceren uitslagen, recente archieven, een simulator en beschrijvende statistieken. We verkopen geen loten en zijn geen FDJ.",
          ],
        },
        {
          heading: "Hoe een trekking verloopt",
          paragraphs: [
            "In de praktijk wordt Loto op meerdere avonden per week getrokken (maandag, woensdag, zaterdag — indicatieve tijden, Europa/Parijs). De exacte tijden bepaalt FDJ.",
            "Na de trekking publiceren openbare bronnen de 5 nummers, de Chance, soms een jackpot. EuroMillions Uitslagen bevraagt die bronnen en toont de fiche van de dag.",
          ],
        },
        {
          heading: "Een fiche lezen",
          paragraphs: [
            "Elke Loto-fiche toont de datum, de 5 nummers (oplopend) en de Chance. De simulator vergelijkt een grid met een al gepubliceerde trekking — hij voorspelt niets.",
            "Frequenties beschrijven alleen het verleden van het lokale archief. Een «achterstallig» nummer is niet waarschijnlijker bij de volgende trekking.",
          ],
        },
        {
          heading: "Jackpot en rangen",
          paragraphs: [
            "Rang 1 (5 nummers + Chance) is uiterst zeldzaam. Zonder winnaar wordt de jackpot meestal overgedragen. Een aangekondigd bedrag is geen persoonlijke winst.",
            "Alleen de operator is gezaghebbend voor een uitbetaling.",
          ],
        },
        {
          heading: "Simulator en archieven",
          paragraphs: [
            "Op de Loto-pagina kiest u 5 nummers en een Chance, daarna vergelijkt u met de gekozen trekking. Een teller toont hoeveel andere lokale trekkingen minstens 3 nummers delen.",
            "De begeleidende archieven zijn korter dan de EuroMillions-geschiedenis. We bewaren tot 250 trekkingen.",
          ],
        },
        {
          heading: "Verantwoord spelen",
          paragraphs: [
            "Om te spelen: alleen een legale operator, meerderjarigen (18+), vrijetijdsbudget.",
            playNl,
          ],
        },
      ],
    },
  },
  "comprendre-eurodreams": {
    it: {
      title: "Capire EuroDreams",
      subtitle:
        "6 numeri su 40, numero Dream, possibile rendita — lettura di un risultato, senza metodo miracoloso.",
      sections: [
        {
          heading: "Cos’è EuroDreams",
          paragraphs: [
            "EuroDreams è un’estrazione europea proposta anche via FDJ: 6 numeri su 40 e un Dream su 5. Il rango 1 è spesso una rendita mensile per un numero di anni fissato dal regolamento — non è un jackpot cash identico all’EuroMillions.",
            "Mostriamo il risultato pubblico. Non calcoliamo la vostra rendita personale e non vendiamo biglietti.",
          ],
        },
        {
          heading: "Orari e lettura",
          paragraphs: [
            "Le estrazioni si tengono in genere a inizio e fine settimana (orari indicativi). Consultate la pagina EuroDreams per il prossimo slot e l’ultimo risultato.",
            "La scheda mostra i 6 numeri e il Dream. Una rendita indicata è un dato di fonte pubblica, non una vincita garantita.",
          ],
        },
        {
          heading: "Categorie e Dream",
          paragraphs: [
            "Le categorie dipendono dai numeri giusti e dal Dream. Il simulatore conta i numeri in comune e se il Dream corrisponde — per verificare una griglia, non per «ottimizzare» un rango.",
          ],
        },
        {
          heading: "Simulatore",
          paragraphs: [
            "Scegliete 6 numeri (1–40) e un Dream (1–5), poi la data. Lo strumento confronta con il risultato pubblicato. Non è un pronostico.",
          ],
        },
        {
          heading: "Risultati",
          paragraphs: [
            "Gli archivi EuroDreams sono limitati dall’API pubblica FDJ (decine di estrazioni, non anni). L’EuroMillions resta il focus del sito.",
          ],
        },
        {
          heading: "Gioco responsabile",
          paragraphs: [
            "Una rendita indicata non è un reddito. 18+, budget per il tempo libero, operatore legale.",
            playIt,
          ],
        },
      ],
    },
    es: {
      title: "Entender EuroDreams",
      subtitle:
        "6 números de 40, número Dream, renta posible — lectura de un resultado, sin método milagroso.",
      sections: [
        {
          heading: "Qué es EuroDreams",
          paragraphs: [
            "EuroDreams es un sorteo europeo ofrecido también vía FDJ: 6 números de 40 y un Dream de 5. La categoría 1 suele ser una renta mensual durante un número de años del reglamento — no es un bote en efectivo idéntico a EuroMillions.",
            "Mostramos el resultado público. No calculamos su renta personal ni vendemos boletos.",
          ],
        },
        {
          heading: "Horarios y lectura",
          paragraphs: [
            "Los sorteos suelen ser a principios y finales de semana. Consulte la página EuroDreams para el próximo hueco y el último resultado.",
            "La ficha muestra los 6 números y el Dream. Una renta indicada es un dato de fuente pública, no un premio garantizado.",
          ],
        },
        {
          heading: "Categorías y Dream",
          paragraphs: [
            "Las categorías dependen de los números acertados y del Dream. El simulador cuenta coincidencias — para comprobar una combinación, no para «optimizar» una categoría.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Elija 6 números (1–40) y un Dream (1–5), luego la fecha. La herramienta compara con el resultado publicado. No es un pronóstico.",
          ],
        },
        {
          heading: "Resultados",
          paragraphs: [
            "Los archivos EuroDreams están limitados por la API pública FDJ. EuroMillions sigue siendo el foco del sitio.",
          ],
        },
        {
          heading: "Juego responsable",
          paragraphs: [
            "Una renta indicada no es un ingreso. 18+, presupuesto de ocio, operador legal.",
            playEs,
          ],
        },
      ],
    },
    pt: {
      title: "Compreender o EuroDreams",
      subtitle:
        "6 números em 40, número Dream, renda possível — leitura de um resultado, sem método milagroso.",
      sections: [
        {
          heading: "O que é o EuroDreams",
          paragraphs: [
            "EuroDreams é um sorteio europeu também via FDJ: 6 números em 40 e um Dream em 5. O 1.º escalão é muitas vezes uma renda mensal durante um número de anos do regulamento — não é um jackpot em numerário idêntico ao EuroMillions.",
            "Mostramos o resultado público. Não calculamos a sua renda pessoal nem vendemos bilhetes.",
          ],
        },
        {
          heading: "Horários e leitura",
          paragraphs: [
            "Os sorteios costumam ser no início e no fim da semana. Consulte a página EuroDreams para o próximo horário e o último resultado.",
            "A ficha mostra os 6 números e o Dream. Uma renda indicada é um dado de fonte pública, não um prémio garantido.",
          ],
        },
        {
          heading: "Escalões e Dream",
          paragraphs: [
            "Os escalões dependem dos números certos e do Dream. O simulador conta coincidências — para verificar uma grelha, não para «optimizar» um escalão.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Escolha 6 números (1–40) e um Dream (1–5), depois a data. A ferramenta compara com o resultado publicado. Não é um prognóstico.",
          ],
        },
        {
          heading: "Resultados",
          paragraphs: [
            "Os arquivos EuroDreams estão limitados pela API pública FDJ. O EuroMillions continua a ser o foco do site.",
          ],
        },
        {
          heading: "Jogo responsável",
          paragraphs: [
            "Uma renda indicada não é um rendimento. 18+, orçamento de lazer, operador legal.",
            playPt,
          ],
        },
      ],
    },
    de: {
      title: "EuroDreams verstehen",
      subtitle:
        "6 Zahlen aus 40, Dream-Zahl, mögliche Rente — Ergebnis lesen, ohne Wundermethode.",
      sections: [
        {
          heading: "Was EuroDreams ist",
          paragraphs: [
            "EuroDreams ist eine europäische Ziehung, unter anderem über FDJ: 6 Zahlen aus 40 und eine Dream-Zahl aus 5. Rang 1 ist oft eine monatliche Rente für eine im Regelwerk festgelegte Anzahl Jahre — kein Cash-Jackpot wie EuroMillions.",
            "Wir zeigen das öffentliche Ergebnis. Wir berechnen nicht Ihre persönliche Rente und verkaufen keine Tippscheine.",
          ],
        },
        {
          heading: "Zeiten und Lesen",
          paragraphs: [
            "Ziehungen meist am Anfang und Ende der Woche. Die EuroDreams-Seite nennt den nächsten Slot und das letzte Ergebnis.",
            "Die Karte zeigt 6 Zahlen und Dream. Eine angegebene Rente ist eine öffentliche Quelle, kein garantierter Gewinn.",
          ],
        },
        {
          heading: "Ränge und Dream",
          paragraphs: [
            "Ränge hängen von richtigen Zahlen und dem Dream ab. Der Simulator zählt Treffer — zum Prüfen eines Grids, nicht zum «Optimieren» eines Rangs.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Wählen Sie 6 Zahlen (1–40) und einen Dream (1–5), dann das Datum. Das Tool vergleicht mit dem veröffentlichten Ergebnis. Keine Prognose.",
          ],
        },
        {
          heading: "Ergebnisse",
          paragraphs: [
            "EuroDreams-Archive sind durch die öffentliche FDJ-API begrenzt. EuroMillions bleibt der Fokus der Website.",
          ],
        },
        {
          heading: "Verantwortungsvolles Spiel",
          paragraphs: [
            "Eine angegebene Rente ist kein Einkommen. 18+, Freizeitbudget, lizenzierter Betreiber.",
            playDe,
          ],
        },
      ],
    },
    nl: {
      title: "EuroDreams begrijpen",
      subtitle:
        "6 nummers uit 40, Dream-nummer, mogelijke rente — een uitslag lezen, zonder wondermethode.",
      sections: [
        {
          heading: "Wat EuroDreams is",
          paragraphs: [
            "EuroDreams is een Europese trekking, onder meer via FDJ: 6 nummers uit 40 en een Dream uit 5. Rang 1 is vaak een maandelijkse rente voor een in het reglement vastgelegd aantal jaren — geen cash-jackpot zoals EuroMillions.",
            "We tonen de openbare uitslag. We berekenen uw persoonlijke rente niet en verkopen geen loten.",
          ],
        },
        {
          heading: "Tijden en lezen",
          paragraphs: [
            "Trekkingen meestal vroeg en laat in de week. De EuroDreams-pagina noemt het volgende slot en de laatste uitslag.",
            "De fiche toont 6 nummers en de Dream. Een vermelde rente is een openbare bron, geen gegarandeerde winst.",
          ],
        },
        {
          heading: "Rangen en Dream",
          paragraphs: [
            "Rangen hangen af van juiste nummers en de Dream. De simulator telt treffers — om een grid te controleren, niet om een rang te «optimaliseren».",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Kies 6 nummers (1–40) en een Dream (1–5), daarna de datum. De tool vergelijkt met de gepubliceerde uitslag. Geen prognose.",
          ],
        },
        {
          heading: "Uitslagen",
          paragraphs: [
            "EuroDreams-archieven zijn beperkt door de openbare FDJ-API. EuroMillions blijft de focus van de site.",
          ],
        },
        {
          heading: "Verantwoord spelen",
          paragraphs: [
            "Een vermelde rente is geen inkomen. 18+, vrijetijdsbudget, legale operator.",
            playNl,
          ],
        },
      ],
    },
  },
  "comprendre-keno": {
    it: {
      title: "Capire il Keno",
      subtitle:
        "Estrazioni mezzogiorno e sera, 16 numeri su 70, se ne giocano 4–10 — lettura e simulatore.",
      sections: [
        {
          heading: "Il principio",
          paragraphs: [
            "Al Keno (formula 2025) l’operatore estrae 16 numeri su 70. Voi scegliete quanti numeri giocare (4–10). Il premio dipende dai numeri indovinati e dal formato di puntata — barème FDJ pubblicato su ogni scheda.",
            "Mostriamo i numeri pubblicati per ogni fascia (mezzogiorno / sera). Non vendiamo biglietti.",
          ],
        },
        {
          heading: "Mezzogiorno e sera",
          paragraphs: [
            "Di solito due estrazioni al giorno civile. Ogni scheda ha un URL distinto (data + mezzogiorno o sera).",
            "Gli orari esatti spettano a FDJ.",
          ],
        },
        {
          heading: "Leggere una scheda",
          paragraphs: [
            "La scheda elenca i numeri estratti. Lo storico locale è più corto dell’EuroMillions. Un moltiplicatore, se presente, è un dato accessorio.",
          ],
        },
        {
          heading: "Simulatore",
          paragraphs: [
            "Scegliete quanti numeri «giocate» (4–10, default 7), poi spuntateli (1–70). Lo strumento conta i numeri in comune e mostra categoria / importo pubblicati.",
          ],
        },
        {
          heading: "Statistiche",
          paragraphs: [
            "Le frequenze riguardano i numeri estratti nell’archivio locale, non la vostra dimensione di griglia. Non mescolate le stats tra giochi.",
          ],
        },
        {
          heading: "Gioco responsabile",
          paragraphs: [
            "Più estrazioni al giorno non invitano a giocare più spesso. 18+, budget, operatore legale.",
            playIt,
          ],
        },
      ],
    },
    es: {
      title: "Entender el Keno",
      subtitle:
        "Sorteos mediodía y noche, 16 números de 70, se juegan 4–10 — lectura y simulador.",
      sections: [
        {
          heading: "El principio",
          paragraphs: [
            "En el Keno (fórmula 2025) el operador extrae 16 números de 70. Usted elige cuántos jugar (4–10). El premio depende de los aciertos y del formato de apuesta — baremo FDJ publicado en cada ficha.",
            "Mostramos los números publicados por franja (mediodía / noche). No vendemos boletos.",
          ],
        },
        {
          heading: "Mediodía y noche",
          paragraphs: [
            "Suelen ser dos sorteos por día civil. Cada ficha tiene una URL distinta (fecha + mediodía o noche).",
            "Los horarios exactos los fija FDJ.",
          ],
        },
        {
          heading: "Leer una ficha",
          paragraphs: [
            "La ficha lista los números extraídos. El historial local es más corto que el de EuroMillions. Un multiplicador, si existe, es un dato anejo.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Elija cuántos números «juega» (4–10, por defecto 7), luego márquelos (1–70). La herramienta cuenta coincidencias y muestra categoría / importe publicados.",
          ],
        },
        {
          heading: "Estadísticas",
          paragraphs: [
            "Las frecuencias cubren los números extraídos en el archivo local, no el tamaño de su combinación. No mezcle estadísticas entre juegos.",
          ],
        },
        {
          heading: "Juego responsable",
          paragraphs: [
            "Varios sorteos al día no invitan a jugar más a menudo. 18+, presupuesto, operador legal.",
            playEs,
          ],
        },
      ],
    },
    pt: {
      title: "Compreender o Keno",
      subtitle:
        "Sorteios de meio-dia e noite, 16 números em 70, jogam-se 4–10 — leitura e simulador.",
      sections: [
        {
          heading: "O princípio",
          paragraphs: [
            "No Keno (fórmula 2025) o operador tira 16 números em 70. Escolhe quantos jogar (4–10). O prémio depende dos acertos e do formato de aposta — tabela FDJ publicada em cada ficha.",
            "Mostramos os números publicados por faixa (meio-dia / noite). Não vendemos bilhetes.",
          ],
        },
        {
          heading: "Meio-dia e noite",
          paragraphs: [
            "Em geral dois sorteios por dia civil. Cada ficha tem um URL distinto (data + meio-dia ou noite).",
            "Os horários exactos cabem à FDJ.",
          ],
        },
        {
          heading: "Ler uma ficha",
          paragraphs: [
            "A ficha lista os números tirados. O histórico local é mais curto do que o EuroMillions. Um multiplicador, se existir, é um dado anexo.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Escolha quantos números «joga» (4–10, predefinição 7), depois marque-os (1–70). A ferramenta conta coincidências e mostra escalão / montante publicados.",
          ],
        },
        {
          heading: "Estatísticas",
          paragraphs: [
            "As frequências cobrem os números tirados no arquivo local, não o tamanho da sua grelha. Não misture estatísticas entre jogos.",
          ],
        },
        {
          heading: "Jogo responsável",
          paragraphs: [
            "Vários sorteios por dia não convidam a jogar mais vezes. 18+, orçamento, operador legal.",
            playPt,
          ],
        },
      ],
    },
    de: {
      title: "Keno verstehen",
      subtitle:
        "Mittags- und Abendziehungen, 16 Zahlen aus 70, Sie spielen 4–10 — Lesen und Simulator.",
      sections: [
        {
          heading: "Das Prinzip",
          paragraphs: [
            "Beim Keno (Formel 2025) zieht der Betreiber 16 Zahlen aus 70. Sie wählen, wie viele Sie spielen (4–10). Der Gewinn hängt von Treffern und Einsatzformat ab — FDJ-Tabelle auf jeder Karte.",
            "Wir zeigen die veröffentlichten Zahlen je Slot (Mittag / Abend). Kein Tippscheinverkauf.",
          ],
        },
        {
          heading: "Mittag und Abend",
          paragraphs: [
            "Meist zwei Ziehungen pro Kalendertag. Jede Karte hat eine eigene URL (Datum + Mittag oder Abend).",
            "Die genauen Zeiten legt FDJ fest.",
          ],
        },
        {
          heading: "Eine Karte lesen",
          paragraphs: [
            "Die Karte listet die gezogenen Zahlen. Die lokale Historie ist kürzer als bei EuroMillions. Ein Multiplikator, falls vorhanden, ist Zusatzinformation.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Wählen Sie, wie viele Zahlen Sie «spielen» (4–10, Standard 7), dann kreuzen Sie sie an (1–70). Das Tool zählt Treffer und zeigt Rang / Betrag.",
          ],
        },
        {
          heading: "Statistik",
          paragraphs: [
            "Häufigkeiten betreffen gezogene Zahlen im lokalen Archiv, nicht Ihre Tippgröße. Statistiken nicht über Spiele mischen.",
          ],
        },
        {
          heading: "Verantwortungsvolles Spiel",
          paragraphs: [
            "Mehrere Ziehungen am Tag laden nicht dazu ein, öfter zu spielen. 18+, Budget, lizenzierter Betreiber.",
            playDe,
          ],
        },
      ],
    },
    nl: {
      title: "Keno begrijpen",
      subtitle:
        "Middag- en avondtrekkingen, 16 nummers uit 70, u speelt 4–10 — lezen en simulator.",
      sections: [
        {
          heading: "Het principe",
          paragraphs: [
            "Bij Keno (formule 2025) trekt de operator 16 nummers uit 70. U kiest hoeveel u speelt (4–10). De winst hangt af van treffers en inzetformaat — FDJ-tabel op elke fiche.",
            "We tonen de gepubliceerde nummers per slot (middag / avond). Geen lotverkoop.",
          ],
        },
        {
          heading: "Middag en avond",
          paragraphs: [
            "Meestal twee trekkingen per kalenderdag. Elke fiche heeft een eigen URL (datum + middag of avond).",
            "De exacte tijden bepaalt FDJ.",
          ],
        },
        {
          heading: "Een fiche lezen",
          paragraphs: [
            "De fiche somt de getrokken nummers op. De lokale geschiedenis is korter dan bij EuroMillions. Een multiplier, indien aanwezig, is bijkomende info.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Kies hoeveel nummers u «speelt» (4–10, standaard 7), vink ze dan aan (1–70). De tool telt treffers en toont rang / bedrag.",
          ],
        },
        {
          heading: "Statistieken",
          paragraphs: [
            "Frequenties betreffen getrokken nummers in het lokale archief, niet uw gridgrootte. Meng statistieken niet tussen spellen.",
          ],
        },
        {
          heading: "Verantwoord spelen",
          paragraphs: [
            "Meerdere trekkingen per dag zijn geen uitnodiging om vaker te spelen. 18+, budget, legale operator.",
            playNl,
          ],
        },
      ],
    },
  },
  "comprendre-crescendo": {
    it: {
      title: "Capire Crescendo",
      subtitle:
        "10 numeri su 25, una lettera, più estrazioni il sabato — lettura e simulatore.",
      sections: [
        {
          heading: "Cos’è Crescendo",
          paragraphs: [
            "Crescendo è un’estrazione FDJ: 10 numeri su 25 e una lettera. Più estrazioni possono avvenire il sabato, a orari diversi — ogni scheda ha un URL unico (data + ora di Parigi).",
            "Sito indipendente: risultati pubblici, archivi recenti, simulatore. Nessuna vendita di biglietti.",
          ],
        },
        {
          heading: "Più estrazioni lo stesso giorno",
          paragraphs: [
            "A differenza dell’EuroMillions (una griglia per data), Crescendo può pubblicare più risultati lo stesso sabato. Non confrontate una griglia con «l’estrazione del sabato» senza l’ora.",
          ],
        },
        {
          heading: "Numeri e lettera",
          paragraphs: [
            "La scheda mostra i 10 numeri e la lettera. Il simulatore conta i numeri in comune e se la lettera corrisponde. Non è un calcolo in euro.",
          ],
        },
        {
          heading: "Simulatore",
          paragraphs: [
            "Spuntate 10 numeri (1–25) e una lettera A–Z, scegliete l’estrazione (data-ora), poi verificate. Il caso non ha memoria.",
          ],
        },
        {
          heading: "Risultati",
          paragraphs: [
            "Lo storico locale è limitato dall’API pubblica. Conserviamo fino a 250 risultati quando la fonte li fornisce.",
          ],
        },
        {
          heading: "Gioco responsabile",
          paragraphs: [
            "Più estrazioni il sabato non implicano di puntare su ciascuna. 18+, budget, operatore legale.",
            playIt,
          ],
        },
      ],
    },
    es: {
      title: "Entender Crescendo",
      subtitle:
        "10 números de 25, una letra, varios sorteos el sábado — lectura y simulador.",
      sections: [
        {
          heading: "Qué es Crescendo",
          paragraphs: [
            "Crescendo es un sorteo FDJ: 10 números de 25 y una letra. Puede haber varios sorteos el sábado, a horas distintas — cada ficha tiene una URL única (fecha + hora de París).",
            "Sitio independiente: resultados públicos, archivos recientes, simulador. Sin venta de boletos.",
          ],
        },
        {
          heading: "Varios sorteos el mismo día",
          paragraphs: [
            "A diferencia de EuroMillions (una combinación por fecha), Crescendo puede publicar varios resultados el mismo sábado. No compare una combinación con «el sorteo del sábado» sin la hora.",
          ],
        },
        {
          heading: "Números y letra",
          paragraphs: [
            "La ficha muestra los 10 números y la letra. El simulador cuenta coincidencias y si la letra acierta. No es un cálculo en euros.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Marque 10 números (1–25) y una letra A–Z, elija el sorteo (fecha-hora) y compruebe. El azar no tiene memoria.",
          ],
        },
        {
          heading: "Resultados",
          paragraphs: [
            "El historial local está limitado por la API pública. Conservamos hasta 250 resultados cuando la fuente los aporta.",
          ],
        },
        {
          heading: "Juego responsable",
          paragraphs: [
            "Varios sorteos el sábado no implican apostar en cada uno. 18+, presupuesto, operador legal.",
            playEs,
          ],
        },
      ],
    },
    pt: {
      title: "Compreender o Crescendo",
      subtitle:
        "10 números em 25, uma letra, vários sorteios ao sábado — leitura e simulador.",
      sections: [
        {
          heading: "O que é o Crescendo",
          paragraphs: [
            "Crescendo é um sorteio FDJ: 10 números em 25 e uma letra. Pode haver vários sorteios ao sábado, a horas distintas — cada ficha tem um URL único (data + hora de Paris).",
            "Site independente: resultados públicos, arquivos recentes, simulador. Sem venda de bilhetes.",
          ],
        },
        {
          heading: "Vários sorteios no mesmo dia",
          paragraphs: [
            "Ao contrário do EuroMillions (uma grelha por data), o Crescendo pode publicar vários resultados no mesmo sábado. Não compare uma grelha com «o sorteio de sábado» sem a hora.",
          ],
        },
        {
          heading: "Números e letra",
          paragraphs: [
            "A ficha mostra os 10 números e a letra. O simulador conta coincidências e se a letra acerta. Não é um cálculo em euros.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Marque 10 números (1–25) e uma letra A–Z, escolha o sorteio (data-hora) e verifique. O acaso não tem memória.",
          ],
        },
        {
          heading: "Resultados",
          paragraphs: [
            "O histórico local está limitado pela API pública. Conservamos até 250 resultados quando a fonte os fornece.",
          ],
        },
        {
          heading: "Jogo responsável",
          paragraphs: [
            "Vários sorteios ao sábado não implicam apostar em cada um. 18+, orçamento, operador legal.",
            playPt,
          ],
        },
      ],
    },
    de: {
      title: "Crescendo verstehen",
      subtitle:
        "10 Zahlen aus 25, ein Buchstabe, mehrere Samstagsziehungen — Lesen und Simulator.",
      sections: [
        {
          heading: "Was Crescendo ist",
          paragraphs: [
            "Crescendo ist eine FDJ-Ziehung: 10 Zahlen aus 25 und ein Buchstabe. Am Samstag können mehrere Ziehungen zu unterschiedlichen Zeiten stattfinden — jede Karte hat eine eigene URL (Datum + Pariser Uhrzeit).",
            "Unabhängige Seite: öffentliche Ergebnisse, aktuelle Archive, Simulator. Kein Tippscheinverkauf.",
          ],
        },
        {
          heading: "Mehrere Ziehungen am selben Tag",
          paragraphs: [
            "Anders als EuroMillions (ein Grid pro Datum) kann Crescendo mehrere Ergebnisse am selben Samstag veröffentlichen. Vergleichen Sie ein Grid nicht mit «der Samstagsziehung» ohne Uhrzeit.",
          ],
        },
        {
          heading: "Zahlen und Buchstabe",
          paragraphs: [
            "Die Karte zeigt 10 Zahlen und den Buchstaben. Der Simulator zählt Treffer und ob der Buchstabe stimmt. Keine Euro-Berechnung.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Kreuzen Sie 10 Zahlen (1–25) und einen Buchstaben A–Z an, wählen Sie die Ziehung (Datum-Uhrzeit) und prüfen Sie. Der Zufall hat kein Gedächtnis.",
          ],
        },
        {
          heading: "Ergebnisse",
          paragraphs: [
            "Die lokale Historie ist durch die öffentliche API begrenzt. Wir behalten bis zu 250 Ergebnisse, wenn die Quelle sie liefert.",
          ],
        },
        {
          heading: "Verantwortungsvolles Spiel",
          paragraphs: [
            "Mehrere Samstagsziehungen bedeuten nicht, auf jede zu setzen. 18+, Budget, lizenzierter Betreiber.",
            playDe,
          ],
        },
      ],
    },
    nl: {
      title: "Crescendo begrijpen",
      subtitle:
        "10 nummers uit 25, een letter, meerdere zaterdagtrekkingen — lezen en simulator.",
      sections: [
        {
          heading: "Wat Crescendo is",
          paragraphs: [
            "Crescendo is een FDJ-trekking: 10 nummers uit 25 en een letter. Op zaterdag kunnen meerdere trekkingen op verschillende tijden plaatsvinden — elke fiche heeft een unieke URL (datum + Parijse tijd).",
            "Onafhankelijke site: openbare uitslagen, recente archieven, simulator. Geen lotverkoop.",
          ],
        },
        {
          heading: "Meerdere trekkingen op dezelfde dag",
          paragraphs: [
            "In tegenstelling tot EuroMillions (één grid per datum) kan Crescendo meerdere uitslagen op dezelfde zaterdag publiceren. Vergelijk een grid niet met «de zaterdagtrekking» zonder het uur.",
          ],
        },
        {
          heading: "Nummers en letter",
          paragraphs: [
            "De fiche toont 10 nummers en de letter. De simulator telt treffers en of de letter klopt. Geen euro-berekening.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Vink 10 nummers (1–25) en een letter A–Z aan, kies de trekking (datum-tijd) en controleer. Toeval heeft geen geheugen.",
          ],
        },
        {
          heading: "Uitslagen",
          paragraphs: [
            "De lokale geschiedenis is beperkt door de openbare API. We bewaren tot 250 resultaten wanneer de bron ze levert.",
          ],
        },
        {
          heading: "Verantwoord spelen",
          paragraphs: [
            "Meerdere zaterdagtrekkingen betekenen niet inzetten op elk. 18+, budget, legale operator.",
            playNl,
          ],
        },
      ],
    },
  },
  "lire-resultats-tirages": {
    it: {
      title: "Leggere un risultato di estrazione",
      subtitle:
        "Metodo comune: scheda, brief, archivi, simulatore — per EuroMillions e i giochi complementari.",
      sections: [
        {
          heading: "Un URL per estrazione",
          paragraphs: [
            "Ogni risultato ha una pagina dedicata. EuroMillions: /tirages/{date}. Loto ed EuroDreams: /jeux/{gioco}/{date}. Keno: data + mezzogiorno o sera. Crescendo: data + ora.",
            "Il brief in testa riformula i numeri pubblicati a partire dai nostri dati, non da un feed estero.",
          ],
        },
        {
          heading: "Cosa mostra una scheda",
          paragraphs: [
            "Data (e fascia se serve), numeri in ordine crescente, bonus, jackpot o rendita quando la fonte li fornisce. Per l’EuroMillions: codice My Million e a volte i premi per categoria.",
            "Gli importi sono informativi. Solo l’operatore valida un biglietto.",
          ],
        },
        {
          heading: "Risultati",
          paragraphs: [
            "Gli archivi EuroMillions mirano a uno storico lungo (backfill progressivo dal 2004). I giochi complementari dipendono dall’API FDJ: decine di estrazioni, non vent’anni.",
          ],
        },
        {
          heading: "Simulatore",
          paragraphs: [
            "Confronta una griglia con un’estrazione già pubblicata. Per l’EuroMillions indica anche la categoria. Per gli altri giochi mostra categoria e importo del barème pubblicato.",
          ],
        },
        {
          heading: "Non incrociare i giochi",
          paragraphs: [
            "Una statistica EuroMillions non dice nulla sul Loto. Nessun «combinato magico». Operatore legale, 18+, budget.",
          ],
        },
        {
          heading: "Gioco responsabile",
          paragraphs: [playIt],
        },
      ],
    },
    es: {
      title: "Leer un resultado de sorteo",
      subtitle:
        "Método común: ficha, brief, archivos, simulador — para EuroMillions y los juegos complementarios.",
      sections: [
        {
          heading: "Una URL por sorteo",
          paragraphs: [
            "Cada resultado tiene una página. EuroMillions: /tirages/{date}. Loto y EuroDreams: /jeux/{juego}/{date}. Keno: fecha + mediodía o noche. Crescendo: fecha + hora.",
            "El brief de cabecera reformula los números publicados a partir de nuestros datos, no de un feed extranjero.",
          ],
        },
        {
          heading: "Qué muestra una ficha",
          paragraphs: [
            "Fecha (y franja si hace falta), números en orden, bonus, bote o renta cuando la fuente los aporta. Para EuroMillions: código My Million y a veces premios por categoría.",
            "Los importes son informativos. Solo el operador valida un boleto.",
          ],
        },
        {
          heading: "Resultados",
          paragraphs: [
            "Los archivos EuroMillions apuntan a un historial largo (backfill progresivo desde 2004). Los juegos complementarios dependen de la API FDJ.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Compara una combinación con un sorteo ya publicado. En EuroMillions indica también la categoría. En los demás muestra categoría e importe del baremo publicado.",
          ],
        },
        {
          heading: "No cruzar juegos",
          paragraphs: [
            "Una estadística EuroMillions no dice nada sobre el Loto. Ningún «combinado mágico». Operador legal, 18+, presupuesto.",
          ],
        },
        {
          heading: "Juego responsable",
          paragraphs: [playEs],
        },
      ],
    },
    pt: {
      title: "Ler um resultado de sorteio",
      subtitle:
        "Método comum: ficha, brief, arquivos, simulador — para EuroMillions e os jogos de acompanhamento.",
      sections: [
        {
          heading: "Um URL por sorteio",
          paragraphs: [
            "Cada resultado tem uma página. EuroMillions: /tirages/{date}. Loto e EuroDreams: /jeux/{jogo}/{date}. Keno: data + meio-dia ou noite. Crescendo: data + hora.",
            "O brief no topo reformula os números publicados a partir dos nossos dados, não de um feed estrangeiro.",
          ],
        },
        {
          heading: "O que mostra uma ficha",
          paragraphs: [
            "Data (e faixa se preciso), números por ordem, bónus, jackpot ou renda quando a fonte os fornece. Para o EuroMillions: código My Million e por vezes prémios por escalão.",
            "Os montantes são informativos. Só o operador valida um bilhete.",
          ],
        },
        {
          heading: "Resultados",
          paragraphs: [
            "Os arquivos EuroMillions visam um histórico longo (backfill progressivo desde 2004). Os jogos de acompanhamento dependem da API FDJ.",
          ],
        },
        {
          heading: "Simulador",
          paragraphs: [
            "Compara uma grelha com um sorteio já publicado. No EuroMillions indica também o escalão. Nos outros mostra escalão e montante da tabela publicada.",
          ],
        },
        {
          heading: "Não cruzar jogos",
          paragraphs: [
            "Uma estatística EuroMillions não diz nada sobre o Loto. Nenhum «combinado mágico». Operador legal, 18+, orçamento.",
          ],
        },
        {
          heading: "Jogo responsável",
          paragraphs: [playPt],
        },
      ],
    },
    de: {
      title: "Ein Ziehungsergebnis lesen",
      subtitle:
        "Gemeinsame Methode: Karte, Brief, Archive, Simulator — für EuroMillions und Begleitspiele.",
      sections: [
        {
          heading: "Eine URL pro Ziehung",
          paragraphs: [
            "Jedes Ergebnis hat eine Seite. EuroMillions: /tirages/{date}. Loto und EuroDreams: /jeux/{spiel}/{date}. Keno: Datum + Mittag oder Abend. Crescendo: Datum + Uhrzeit.",
            "Der Brief oben formuliert die veröffentlichten Zahlen aus unseren Daten, nicht aus einem ausländischen Feed.",
          ],
        },
        {
          heading: "Was eine Karte zeigt",
          paragraphs: [
            "Datum (und Slot falls nötig), Zahlen in Reihenfolge, Bonus, Jackpot oder Rente wenn die Quelle sie liefert. Bei EuroMillions: My-Million-Code und manchmal Preise je Rang.",
            "Beträge sind informativ. Nur der Betreiber validiert einen Tippschein.",
          ],
        },
        {
          heading: "Ergebnisse",
          paragraphs: [
            "EuroMillions-Archive zielen auf eine lange Historie (progressiver Backfill ab 2004). Begleitspiele hängen von der FDJ-API ab.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Vergleicht ein Grid mit einer bereits veröffentlichten Ziehung. Bei EuroMillions auch den Rang. Bei den anderen zeigt er Rang und Betrag der veröffentlichten Tabelle.",
          ],
        },
        {
          heading: "Spiele nicht kreuzen",
          paragraphs: [
            "Eine EuroMillions-Statistik sagt nichts über Loto. Kein «magischer Kombi». Lizenzierter Betreiber, 18+, Budget.",
          ],
        },
        {
          heading: "Verantwortungsvolles Spiel",
          paragraphs: [playDe],
        },
      ],
    },
    nl: {
      title: "Een trekkingsuitslag lezen",
      subtitle:
        "Gemeenschappelijke methode: fiche, brief, archieven, simulator — voor EuroMillions en begeleidende spellen.",
      sections: [
        {
          heading: "Eén URL per trekking",
          paragraphs: [
            "Elke uitslag heeft een pagina. EuroMillions: /tirages/{date}. Loto en EuroDreams: /jeux/{spel}/{date}. Keno: datum + middag of avond. Crescendo: datum + tijd.",
            "De brief bovenaan herformuleert de gepubliceerde nummers uit onze data, niet uit een buitenlandse feed.",
          ],
        },
        {
          heading: "Wat een fiche toont",
          paragraphs: [
            "Datum (en slot indien nodig), nummers in volgorde, bonus, jackpot of rente wanneer de bron ze levert. Voor EuroMillions: My Million-code en soms prijzen per rang.",
            "Bedragen zijn informatief. Alleen de operator valideert een lot.",
          ],
        },
        {
          heading: "Uitslagen",
          paragraphs: [
            "EuroMillions-archieven mikken op een lange geschiedenis (progressieve backfill vanaf 2004). Begeleidende spellen hangen af van de FDJ-API.",
          ],
        },
        {
          heading: "Simulator",
          paragraphs: [
            "Vergelijkt een grid met een al gepubliceerde trekking. Bij EuroMillions ook de rang. Bij de andere toont hij rang en bedrag van de gepubliceerde tabel.",
          ],
        },
        {
          heading: "Spellen niet kruisen",
          paragraphs: [
            "Een EuroMillions-statistiek zegt niets over Loto. Geen «magische combo». Legale operator, 18+, budget.",
          ],
        },
        {
          heading: "Verantwoord spelen",
          paragraphs: [playNl],
        },
      ],
    },
  },
  "horaires-tirages-fdj": {
    it: {
      title: "Orari delle estrazioni FDJ",
      subtitle:
        "Punti di riferimento indicativi (Europa/Parigi) per EuroMillions, Loto, EuroDreams, Keno e Crescendo.",
      sections: [
        {
          heading: "Avvertenza",
          paragraphs: [
            "Orari esatti, festività e rinvii spettano agli operatori. Questa guida aiuta a leggere le nostre pagine, non è un calendario ufficiale.",
            "La pagina «prossima estrazione» EuroMillions mostra un conto alla rovescia verso lo slot abituale (martedì / venerdì verso le 21, ora di Parigi).",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "Di solito martedì e venerdì, verso le 21 (Europa/Parigi). Dopo l’estrazione pubblichiamo numeri, stelle, jackpot e, in Francia, il codice My Million.",
          ],
        },
        {
          heading: "Loto ed EuroDreams",
          paragraphs: [
            "Loto: diverse sere a settimana (lunedì, mercoledì, sabato). EuroDreams: due estrazioni a settimana. Ogni scheda è datata.",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Due fasce al giorno in genere: mezzogiorno e sera. Non verificate un biglietto della sera sul risultato di mezzogiorno.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Più estrazioni il sabato, a orari distinti. L’URL include l’ora di Parigi (HHMM).",
          ],
        },
        {
          heading: "Gioco responsabile",
          paragraphs: [playIt],
        },
      ],
    },
    es: {
      title: "Horarios de los sorteos FDJ",
      subtitle:
        "Referencias orientativas (Europa/París) para EuroMillions, Loto, EuroDreams, Keno y Crescendo.",
      sections: [
        {
          heading: "Aviso",
          paragraphs: [
            "Los horarios exactos, festivos y aplazamientos los fijan los operadores. Esta guía ayuda a leer nuestras páginas, no es un calendario oficial.",
            "La página «próximo sorteo» EuroMillions muestra una cuenta atrás hacia el hueco habitual (martes / viernes hacia las 21 h, hora de París).",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "Suele ser martes y viernes, hacia las 21 h (Europa/París). Tras el sorteo publicamos números, estrellas, bote y, en Francia, el código My Million.",
          ],
        },
        {
          heading: "Loto y EuroDreams",
          paragraphs: [
            "Loto: varias noches por semana (lunes, miércoles, sábado). EuroDreams: dos sorteos por semana. Cada ficha está fechada.",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Dos franjas al día en general: mediodía y noche. No compruebe un boleto de noche con el resultado de mediodía.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Varios sorteos el sábado, a horas distintas. La URL incluye la hora de París (HHMM).",
          ],
        },
        {
          heading: "Juego responsable",
          paragraphs: [playEs],
        },
      ],
    },
    pt: {
      title: "Horários dos sorteios FDJ",
      subtitle:
        "Referências indicativas (Europa/Paris) para EuroMillions, Loto, EuroDreams, Keno e Crescendo.",
      sections: [
        {
          heading: "Aviso",
          paragraphs: [
            "Horários exactos, feriados e adiamentos cabem aos operadores. Este guia ajuda a ler as nossas páginas, não é um calendário oficial.",
            "A página «próximo sorteio» EuroMillions mostra uma contagem decrescente para o horário habitual (terça / sexta por volta das 21 h, hora de Paris).",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "Em geral terça e sexta, por volta das 21 h (Europa/Paris). Após o sorteio publicamos números, estrelas, jackpot e, em França, o código My Million.",
          ],
        },
        {
          heading: "Loto e EuroDreams",
          paragraphs: [
            "Loto: várias noites por semana (segunda, quarta, sábado). EuroDreams: dois sorteios por semana. Cada ficha está datada.",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Duas faixas por dia em geral: meio-dia e noite. Não verifique um bilhete da noite no resultado do meio-dia.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Vários sorteios ao sábado, a horas distintas. O URL inclui a hora de Paris (HHMM).",
          ],
        },
        {
          heading: "Jogo responsável",
          paragraphs: [playPt],
        },
      ],
    },
    de: {
      title: "FDJ-Ziehungszeiten",
      subtitle:
        "Richtwerte (Europa/Paris) für EuroMillions, Loto, EuroDreams, Keno und Crescendo.",
      sections: [
        {
          heading: "Hinweis",
          paragraphs: [
            "Genaue Zeiten, Feiertage und Verschiebungen legen die Betreiber fest. Dieser Guide hilft beim Lesen unserer Seiten, ist kein offizieller Kalender.",
            "Die Seite «nächste Ziehung» EuroMillions zeigt einen Countdown zum üblichen Slot (Dienstag / Freitag gegen 21 Uhr, Pariser Zeit).",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "Meist Dienstag und Freitag, gegen 21 Uhr (Europa/Paris). Nach der Ziehung veröffentlichen wir Zahlen, Sterne, Jackpot und in Frankreich den My-Million-Code.",
          ],
        },
        {
          heading: "Loto und EuroDreams",
          paragraphs: [
            "Loto: mehrere Abende pro Woche (Montag, Mittwoch, Samstag). EuroDreams: zwei Ziehungen pro Woche. Jede Karte ist datiert.",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Meist zwei Slots pro Tag: Mittag und Abend. Prüfen Sie einen Abendschein nicht am Mittagsergebnis.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Mehrere Samstagsziehungen zu unterschiedlichen Zeiten. Die URL enthält die Pariser Uhrzeit (HHMM).",
          ],
        },
        {
          heading: "Verantwortungsvolles Spiel",
          paragraphs: [playDe],
        },
      ],
    },
    nl: {
      title: "FDJ-trekkingstijden",
      subtitle:
        "Indicatieve ijkpunten (Europa/Parijs) voor EuroMillions, Loto, EuroDreams, Keno en Crescendo.",
      sections: [
        {
          heading: "Waarschuwing",
          paragraphs: [
            "Exacte tijden, feestdagen en uitstellen bepaalt de operator. Deze gids helpt onze pagina’s te lezen, het is geen officiële kalender.",
            "De pagina «volgende trekking» EuroMillions toont een countdown naar het gebruikelijke slot (dinsdag / vrijdag rond 21 uur, Parijse tijd).",
          ],
        },
        {
          heading: "EuroMillions",
          paragraphs: [
            "Meestal dinsdag en vrijdag, rond 21 uur (Europa/Parijs). Na de trekking publiceren we nummers, sterren, jackpot en in Frankrijk de My Million-code.",
          ],
        },
        {
          heading: "Loto en EuroDreams",
          paragraphs: [
            "Loto: meerdere avonden per week (maandag, woensdag, zaterdag). EuroDreams: twee trekkingen per week. Elke fiche is gedateerd.",
          ],
        },
        {
          heading: "Keno",
          paragraphs: [
            "Meestal twee slots per dag: middag en avond. Controleer een avondlot niet op de middaguitslag.",
          ],
        },
        {
          heading: "Crescendo",
          paragraphs: [
            "Meerdere zaterdagtrekkingen op verschillende tijden. De URL bevat de Parijse tijd (HHMM).",
          ],
        },
        {
          heading: "Verantwoord spelen",
          paragraphs: [playNl],
        },
      ],
    },
  },
};
