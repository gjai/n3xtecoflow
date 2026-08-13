import type { LocalizedGuideCopy } from "./articles";

export type EmGuideLocaleMap = Record<
  string,
  {
    it: LocalizedGuideCopy;
    es: LocalizedGuideCopy;
    pt: LocalizedGuideCopy;
    de: LocalizedGuideCopy;
    nl: LocalizedGuideCopy;
  }
>;

export const euromillionsGuideLocales: EmGuideLocaleMap = {
  "comprendre-euromillions": {
    it: {
      title: "Capire l’EuroMillions",
      subtitle:
        "Numeri, stelle, jackpot, My Million e come leggere un risultato — senza alcun sistema promesso.",
      sections: [
        {
          heading: "Cos’è (e cosa non è) l’EuroMillions",
          paragraphs: [
            "L’EuroMillions è una lotteria europea: una griglia combina 5 numeri su 50 e 2 stelle su 12. Un’estrazione pubblica seleziona poi una combinazione vincente. Le categorie di premio dipendono da quanti numeri e stelle si indovinano.",
            "Questo sito è indipendente ed editoriale. Pubblichiamo risultati, archivi e spiegazioni. Non vendiamo biglietti, non siamo FDJ, e nulla di quanto scritto qui è un consiglio per «battere» il caso.",
          ],
        },
        {
          heading: "Come si svolge un’estrazione",
          paragraphs: [
            "Le estrazioni si tengono di solito il martedì e il venerdì, verso le 21 (ora di Parigi). Gli orari esatti li fissano gli operatori; li indichiamo solo a titolo orientativo.",
            "Dopo l’estrazione, fonti pubbliche (tra cui l’API dei risultati FDJ) pubblicano i 5 numeri, le 2 stelle, spesso il jackpot annunciato e, in Francia, il codice My Million. EuroMillions Risultati interroga queste fonti e poi mostra la scheda dell’estrazione.",
          ],
        },
        {
          heading: "Leggere una scheda risultato",
          paragraphs: [
            "Ogni scheda mostra la data, i 5 numeri (in ordine crescente), le 2 stelle e, quando la fonte li fornisce: jackpot, codice My Million, a volte i vincitori per categoria.",
            "Gli archivi permettono di ritrovare una data. Il simulatore confronta una griglia con un’estrazione già pubblicata — non predice nulla. Le statistiche di frequenza descrivono solo il passato.",
          ],
        },
        {
          heading: "Jackpot e report",
          paragraphs: [
            "Se non c’è un vincitore di rango 1 (5 numeri + 2 stelle), il jackpot viene in genere riportato all’estrazione successiva, nei limiti del regolamento. Un importo annunciato non è una vincita garantita per voi: è il montepremi del rango 1 di quella estrazione.",
            "Gli importi possono essere suddivisi se più giocatori colpiscono la stessa categoria. I premi delle categorie inferiori variano in base alle puntate e al numero di vincitori.",
          ],
        },
        {
          heading: "Indipendenza e gioco responsabile",
          paragraphs: [
            "Per giocare, usate solo un operatore autorizzato nel vostro Paese (in Francia: una rete abilitata, ad esempio FDJ). Solo maggiorenni (18+). Budget per il tempo libero, mai un «sistema».",
            "18+ · Gioca responsabilmente · Rischio di perdere denaro. Aiuto in Francia: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    es: {
      title: "Entender el EuroMillions",
      subtitle:
        "Números, estrellas, bote, My Million y cómo leer un resultado — sin ningún sistema prometido.",
      sections: [
        {
          heading: "Qué es (y qué no es) el EuroMillions",
          paragraphs: [
            "EuroMillions es una lotería europea: una combinación une 5 números de 50 y 2 estrellas de 12. Un sorteo público selecciona después una combinación ganadora. Las categorías de premio dependen de cuántos números y estrellas aciertes.",
            "Este sitio es independiente y editorial. Publicamos resultados, archivos y explicaciones. No vendemos boletos, no somos FDJ, y nada de lo escrito aquí es un consejo para «vencer» al azar.",
          ],
        },
        {
          heading: "Cómo funciona un sorteo",
          paragraphs: [
            "Los sorteos suelen celebrarse los martes y viernes, hacia las 21 h (hora de París). Los horarios exactos los fijan los operadores; los indicamos solo orientativamente.",
            "Tras el sorteo, fuentes públicas (incluida la API de resultados FDJ) publican los 5 números, las 2 estrellas, a menudo el bote anunciado y, en Francia, el código My Million. EuroMillions Resultados consulta esas fuentes y luego muestra la ficha del sorteo.",
          ],
        },
        {
          heading: "Leer una ficha de resultado",
          paragraphs: [
            "Cada ficha muestra la fecha, los 5 números (en orden ascendente), las 2 estrellas y, cuando la fuente los aporta: bote, código My Million, a veces ganadores por categoría.",
            "Los archivos permiten buscar una fecha. El simulador compara una combinación con un sorteo ya publicado — no predice nada. Las estadísticas de frecuencia solo describen el pasado.",
          ],
        },
        {
          heading: "Bote y acumulaciones",
          paragraphs: [
            "Si no hay ganador de rango 1 (5 números + 2 estrellas), el bote suele acumularse al siguiente sorteo, dentro de las reglas del juego. Un importe anunciado no es un premio garantizado para ti: es el pozo del rango 1 de ese sorteo.",
            "Los importes pueden repartirse si varios jugadores aciertan la misma categoría. Los premios de categorías inferiores varían según las apuestas y el número de ganadores.",
          ],
        },
        {
          heading: "Independencia y juego responsable",
          paragraphs: [
            "Para jugar, usa solo un operador autorizado en tu país (en Francia: una red homologada, por ejemplo FDJ). Solo mayores de edad (18+). Presupuesto de ocio, nunca un «sistema».",
            "18+ · Juega con responsabilidad · Riesgo de perder dinero. Ayuda en Francia: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    pt: {
      title: "Compreender o EuroMillions",
      subtitle:
        "Números, estrelas, jackpot, My Million e como ler um resultado — sem nenhum sistema prometido.",
      sections: [
        {
          heading: "O que é (e o que não é) o EuroMillions",
          paragraphs: [
            "O EuroMillions é uma lotaria europeia: uma grelha combina 5 números em 50 e 2 estrelas em 12. Um sorteio público seleciona depois uma combinação vencedora. Os escalões de prémio dependem de quantos números e estrelas se acertam.",
            "Este site é independente e editorial. Publicamos resultados, arquivos e explicações. Não vendemos bilhetes, não somos a FDJ, e nada aqui é um conselho para «bater» o acaso.",
          ],
        },
        {
          heading: "Como decorre um sorteio",
          paragraphs: [
            "Os sorteios costumam realizar-se à terça e à sexta, por volta das 21h (hora de Paris). Os horários exatos cabem aos operadores; indicamo-los apenas a título orientativo.",
            "Após o sorteio, fontes públicas (incluindo a API de resultados FDJ) publicam os 5 números, as 2 estrelas, muitas vezes o jackpot anunciado e, em França, o código My Million. EuroMillions Resultados consulta essas fontes e depois apresenta a ficha do sorteio.",
          ],
        },
        {
          heading: "Ler uma ficha de resultado",
          paragraphs: [
            "Cada ficha mostra a data, os 5 números (em ordem crescente), as 2 estrelas e, quando a fonte os fornece: jackpot, código My Million, por vezes vencedores por escalão.",
            "Os arquivos permitem procurar uma data. O simulador compara uma grelha com um sorteio já publicado — não prevê nada. As estatísticas de frequência descrevem apenas o passado.",
          ],
        },
        {
          heading: "Jackpot e acumulações",
          paragraphs: [
            "Se não houver vencedor do escalão 1 (5 números + 2 estrelas), o jackpot é em geral acumulado para o sorteio seguinte, dentro das regras do jogo. Um montante anunciado não é um prémio garantido para si: é o poço do escalão 1 desse sorteio.",
            "Os montantes podem ser partilhados se vários jogadores acertarem o mesmo escalão. Os prémios dos escalões inferiores variam com as apostas e o número de vencedores.",
          ],
        },
        {
          heading: "Independência e jogo responsável",
          paragraphs: [
            "Para jogar, use apenas um operador autorizado no seu país (em França: uma rede homologada, por exemplo FDJ). Apenas adultos (18+). Orçamento de lazer, nunca um «sistema».",
            "18+ · Jogue com responsabilidade · Risco de perder dinheiro. Ajuda em França: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    de: {
      title: "EuroMillions verstehen",
      subtitle:
        "Zahlen, Sterne, Jackpot, My Million und wie man ein Ergebnis liest — ohne versprochenes System.",
      sections: [
        {
          heading: "Was EuroMillions ist (und nicht ist)",
          paragraphs: [
            "EuroMillions ist eine europäische Lotterie: Ein Tipp kombiniert 5 Zahlen aus 50 und 2 Sterne aus 12. Eine öffentliche Ziehung wählt dann eine Gewinnkombination. Die Gewinnränge hängen davon ab, wie viele Zahlen und Sterne Sie treffen.",
            "Diese Website ist unabhängig und redaktionell. Wir veröffentlichen Ergebnisse, Archive und Erklärungen. Wir verkaufen keine Tippscheine, wir sind nicht FDJ, und nichts hier ist ein Ratschlag, den Zufall zu «schlagen».",
          ],
        },
        {
          heading: "So läuft eine Ziehung ab",
          paragraphs: [
            "Ziehungen finden in der Regel dienstags und freitags statt, gegen 21 Uhr (Pariser Zeit). Die genauen Zeiten legen die Betreiber fest; wir geben sie nur orientierend an.",
            "Nach der Ziehung veröffentlichen öffentliche Quellen (einschließlich der FDJ-Ergebnis-API) die 5 Zahlen, 2 Sterne, oft den angekündigten Jackpot und in Frankreich den My-Million-Code. EuroMillions Ergebnisse fragt diese Quellen ab und zeigt dann die Ziehungsseite.",
          ],
        },
        {
          heading: "Eine Ergebnisseite lesen",
          paragraphs: [
            "Jede Ziehungsseite zeigt das Datum, 5 Zahlen (aufsteigend), 2 Sterne und, wenn die Quelle sie liefert: Jackpot, My-Million-Code, manchmal Gewinner je Rang.",
            "Das Archiv lässt Sie ein Datum nachschlagen. Der Simulator vergleicht einen Tipp mit einer veröffentlichten Ziehung — er sagt nichts voraus. Häufigkeitsstatistiken beschreiben nur die Vergangenheit.",
          ],
        },
        {
          heading: "Jackpot und Überträge",
          paragraphs: [
            "Gibt es keinen Rang-1-Gewinner (5 Zahlen + 2 Sterne), wird der Jackpot in der Regel auf die nächste Ziehung übertragen, im Rahmen der Spielregeln. Ein angekündigter Betrag ist kein garantierter Gewinn für Sie: Es ist der Rang-1-Topf dieser Ziehung.",
            "Beträge können geteilt werden, wenn mehrere Spieler denselben Rang treffen. Gewinne der unteren Ränge variieren mit den Einsätzen und der Zahl der Gewinner.",
          ],
        },
        {
          heading: "Unabhängigkeit und verantwortungsvolles Spielen",
          paragraphs: [
            "Zum Spielen nutzen Sie nur einen lizenzierten Betreiber in Ihrem Land (in Frankreich: ein zugelassenes Netz, z. B. FDJ). Nur Erwachsene (18+). Freizeitbudget, niemals ein «System».",
            "18+ · Verantwortungsvoll spielen · Risiko, Geld zu verlieren. Hilfe in Frankreich: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
    nl: {
      title: "EuroMillions begrijpen",
      subtitle:
        "Nummers, sterren, jackpot, My Million en hoe u een uitslag leest — zonder beloofd systeem.",
      sections: [
        {
          heading: "Wat EuroMillions is (en niet is)",
          paragraphs: [
            "EuroMillions is een Europese loterij: een rooster combineert 5 nummers uit 50 en 2 sterren uit 12. Een openbare trekking selecteert daarna een winnende combinatie. De prijscategorieën hangen af van hoeveel nummers en sterren u raakt.",
            "Deze site is onafhankelijk en redactioneel. We publiceren uitslagen, archieven en uitleg. We verkopen geen loten, we zijn geen FDJ, en niets hier is advies om het toeval te «verslaan».",
          ],
        },
        {
          heading: "Hoe een trekking verloopt",
          paragraphs: [
            "Trekkingen vinden meestal plaats op dinsdag en vrijdag, rond 21 uur (Parijse tijd). De exacte tijden worden door de operatoren vastgelegd; we geven ze alleen ter indicatie.",
            "Na de trekking publiceren openbare bronnen (waaronder de FDJ-resultaten-API) de 5 nummers, 2 sterren, vaak de aangekondigde jackpot en in Frankrijk de My Million-code. EuroMillions Resultaten bevraagt die bronnen en toont daarna de trekkingspagina.",
          ],
        },
        {
          heading: "Een uitslagpagina lezen",
          paragraphs: [
            "Elke trekkingspagina toont de datum, 5 nummers (oplopend), 2 sterren en, wanneer de bron ze levert: jackpot, My Million-code, soms winnaars per rang.",
            "De archieven laten u een datum opzoeken. De simulator vergelijkt een rooster met een gepubliceerde trekking — hij voorspelt niets. Frequentiecijfers beschrijven alleen het verleden.",
          ],
        },
        {
          heading: "Jackpot en doorschuivingen",
          paragraphs: [
            "Als er geen rang-1-winnaar is (5 nummers + 2 sterren), wordt de jackpot meestal doorgeschoven naar de volgende trekking, binnen de spelregels. Een aangekondigd bedrag is geen gegarandeerde winst voor u: het is de rang-1-pot van die trekking.",
            "Bedragen kunnen worden gedeeld als meerdere spelers dezelfde rang raken. Prijzen van lagere rangen variëren met de inzetten en het aantal winnaars.",
          ],
        },
        {
          heading: "Onafhankelijkheid en verantwoord spelen",
          paragraphs: [
            "Om te spelen, gebruik alleen een vergunde operator in uw land (in Frankrijk: een erkend netwerk, bijvoorbeeld FDJ). Alleen volwassenen (18+). Vrijetijdsbudget, nooit een «systeem».",
            "18+ · Speel verantwoord · Risico om geld te verliezen. Hulp in Frankrijk: Joueurs Info Service — 09 74 75 13 13 — joueurs-info-service.fr.",
          ],
        },
      ],
    },
  },
  "probabilites-euromillions": {
    it: {
      title: "Probabilità EuroMillions",
      subtitle:
        "Ordini di grandezza utili — e perché nessun «sistema» batte il caso.",
      sections: [
        {
          heading: "Il jackpot è estremamente raro",
          paragraphs: [
            "Ci sono C(50,5) × C(12,2) = 139.838.160 griglie possibili. Vincere il rango 1 (5 numeri + 2 stelle) è quindi dell’ordine di una chance su 140 milioni, per una griglia semplice.",
            "Le categorie inferiori sono più frequenti, con premi più modesti. Una griglia «ben scelta» non ha più probabilità di una estratta a caso: ogni combinazione equiprobabile resta equiprobabile.",
          ],
        },
        {
          heading: "Miti: numeri caldi, date di nascita, sistemi",
          paragraphs: [
            "Le date di nascita (1–31) concentrano le puntate su un sottoinsieme. Questo non cambia la probabilità di vincere; in caso di premio condiviso, può solo aumentare il numero di co-vincitori.",
            "I «numeri caldi» o «in ritardo» descrivono il passato. Un’estrazione non ha memoria. Un ritardo lungo non aumenta la chance che un numero esca la volta successiva.",
            "Le puntate multiple (più numeri, più stelle) coprono più combinazioni, quindi costano di più — non migliorano il rapporto chance/puntata di una combinazione data.",
          ],
        },
        {
          heading: "A cosa servono le statistiche di questo sito",
          paragraphs: [
            "Le tabelle di frequenze e ritardi visualizzano lo storico locale. Aiutano a leggere la distribuzione osservata, non a prevedere il prossimo risultato.",
            "Il simulatore verifica una griglia già giocata (o fittizia) rispetto a estrazioni pubblicate. Non è uno strumento di pronostico.",
          ],
        },
        {
          heading: "Conseguenza pratica",
          paragraphs: [
            "Se giocate, trattatelo come un passatempo con budget — mai come un investimento o un reddito. 18+ · rischio di perdita.",
          ],
        },
      ],
    },
    es: {
      title: "Probabilidades EuroMillions",
      subtitle:
        "Órdenes de magnitud útiles — y por qué ningún «sistema» vence al azar.",
      sections: [
        {
          heading: "El bote es extremadamente raro",
          paragraphs: [
            "Hay C(50,5) × C(12,2) = 139.838.160 combinaciones posibles. Ganar el rango 1 (5 números + 2 estrellas) es por tanto del orden de una posibilidad entre 140 millones, para una combinación simple.",
            "Las categorías inferiores son más frecuentes, con premios más modestos. Una combinación «bien elegida» no tiene más probabilidades que una al azar: cada combinación equiprobable sigue siéndolo.",
          ],
        },
        {
          heading: "Mitos: números calientes, fechas de nacimiento, sistemas",
          paragraphs: [
            "Las fechas de nacimiento (1–31) concentran las apuestas en un subconjunto. Eso no cambia la probabilidad de ganar; si el premio se reparte, solo puede aumentar el número de coganadores.",
            "Los «números calientes» o «retrasados» describen el pasado. Un sorteo no tiene memoria. Un retraso largo no aumenta la probabilidad de que un número salga la próxima vez.",
            "Las apuestas múltiples (más números, más estrellas) cubren más combinaciones, así que cuestan más: no mejoran la relación probabilidad/apuesta de una línea dada.",
          ],
        },
        {
          heading: "Para qué sirven las estadísticas de este sitio",
          paragraphs: [
            "Las tablas de frecuencias y retrasos visualizan el historial local. Ayudan a leer la distribución observada, no a anticipar el próximo resultado.",
            "El simulador comprueba una combinación ya jugada (o ficticia) frente a sorteos publicados. No es una herramienta de pronóstico.",
          ],
        },
        {
          heading: "Consecuencia práctica",
          paragraphs: [
            "Si juegas, trátalo como ocio con presupuesto — nunca como una inversión ni un ingreso. 18+ · riesgo de pérdida.",
          ],
        },
      ],
    },
    pt: {
      title: "Probabilidades EuroMillions",
      subtitle:
        "Ordens de grandeza úteis — e por que nenhum «sistema» bate o acaso.",
      sections: [
        {
          heading: "O jackpot é extremamente raro",
          paragraphs: [
            "Há C(50,5) × C(12,2) = 139 838 160 grelhas possíveis. Ganhar o escalão 1 (5 números + 2 estrelas) é portanto da ordem de uma hipótese em 140 milhões, para uma grelha simples.",
            "Os escalões inferiores são mais frequentes, com prémios mais modestos. Uma grelha «bem escolhida» não tem mais hipóteses do que uma tirada ao acaso: cada combinação equiprovável continua equiprovável.",
          ],
        },
        {
          heading: "Mitos: números quentes, datas de nascimento, sistemas",
          paragraphs: [
            "As datas de nascimento (1–31) concentram as apostas num subconjunto. Isso não altera a probabilidade de ganhar; se o prémio for partilhado, só pode aumentar o número de co-vencedores.",
            "Os «números quentes» ou «em atraso» descrevem o passado. Um sorteio não tem memória. Um atraso longo não aumenta a hipótese de um número sair da próxima vez.",
            "As apostas múltiplas (mais números, mais estrelas) cobrem mais combinações, logo custam mais — não melhoram a relação hipótese/aposta de uma combinação dada.",
          ],
        },
        {
          heading: "Para que servem as estatísticas deste site",
          paragraphs: [
            "As tabelas de frequências e atrasos visualizam o histórico local. Ajudam a ler a distribuição observada, não a antecipar o próximo resultado.",
            "O simulador verifica uma grelha já jogada (ou fictícia) contra sorteios publicados. Não é uma ferramenta de prognóstico.",
          ],
        },
        {
          heading: "Consequência prática",
          paragraphs: [
            "Se jogar, trate-o como lazer orçamentado — nunca como um investimento nem um rendimento. 18+ · risco de perda.",
          ],
        },
      ],
    },
    de: {
      title: "EuroMillions-Wahrscheinlichkeiten",
      subtitle:
        "Nützliche Größenordnungen — und warum kein «System» den Zufall schlägt.",
      sections: [
        {
          heading: "Der Jackpot ist extrem selten",
          paragraphs: [
            "Es gibt C(50,5) × C(12,2) = 139.838.160 mögliche Tipps. Rang 1 zu gewinnen (5 Zahlen + 2 Sterne) liegt daher bei etwa einer Chance zu 140 Millionen, für einen einfachen Tipp.",
            "Niedrigere Ränge sind häufiger, mit bescheideneren Gewinnen. Ein «sorgfältig gewählter» Tipp ist nicht wahrscheinlicher als ein zufälliger: Jede gleich wahrscheinliche Kombination bleibt gleich wahrscheinlich.",
          ],
        },
        {
          heading: "Mythen: heiße Zahlen, Geburtstage, Systeme",
          paragraphs: [
            "Geburtstage (1–31) konzentrieren Einsätze auf eine Teilmenge. Das ändert die Gewinnwahrscheinlichkeit nicht; bei geteiltem Gewinn kann es nur die Zahl der Mitgewinner erhöhen.",
            "«Heiße» oder «überfällige» Zahlen beschreiben die Vergangenheit. Eine Ziehung hat kein Gedächtnis. Ein langer Rückstand erhöht nicht die Chance, dass eine Zahl beim nächsten Mal fällt.",
            "Mehrfachwetten (mehr Zahlen, mehr Sterne) decken mehr Kombinationen ab und kosten daher mehr — sie verbessern nicht das Chancen-pro-Kombination-Verhältnis einer gegebenen Linie.",
          ],
        },
        {
          heading: "Wofür die Statistik dieser Website da ist",
          paragraphs: [
            "Häufigkeits- und Rückstandstabellen visualisieren die lokale Historie. Sie helfen, die beobachtete Verteilung zu lesen, nicht das nächste Ergebnis vorherzusagen.",
            "Der Simulator prüft einen gespielten (oder fiktiven) Tipp gegen veröffentlichte Ziehungen. Es ist kein Prognose-Tool.",
          ],
        },
        {
          heading: "Praktische Folgerung",
          paragraphs: [
            "Wenn Sie spielen, behandeln Sie es als budgetierte Freizeit — niemals als Investition oder Einkommen. 18+ · Verlustrisiko.",
          ],
        },
      ],
    },
    nl: {
      title: "EuroMillions-kansen",
      subtitle:
        "Nuttige ordes van grootte — en waarom geen «systeem» het toeval verslaat.",
      sections: [
        {
          heading: "De jackpot is extreem zeldzaam",
          paragraphs: [
            "Er zijn C(50,5) × C(12,2) = 139.838.160 mogelijke roosters. Rang 1 winnen (5 nummers + 2 sterren) is dus ongeveer één kans op 140 miljoen, voor een enkel rooster.",
            "Lagere rangen komen vaker voor, met bescheidener prijzen. Een «zorgvuldig gekozen» rooster is niet waarschijnlijker dan een willekeurig: elke even waarschijnlijke combinatie blijft even waarschijnlijk.",
          ],
        },
        {
          heading: "Mythes: hete nummers, geboortedata, systemen",
          paragraphs: [
            "Geboortedata (1–31) concentreren inzetten op een deelverzameling. Dat verandert de kans om te winnen niet; bij een gedeelde prijs kan het alleen het aantal mede-winnaars verhogen.",
            "«Hete» of «achterstallige» nummers beschrijven het verleden. Een trekking heeft geen geheugen. Een lange achterstand verhoogt niet de kans dat een nummer de volgende keer valt.",
            "Meervoudige inzetten (meer nummers, meer sterren) dekken meer combinaties, dus kosten ze meer — ze verbeteren de kans-per-combinatie van een gegeven lijn niet.",
          ],
        },
        {
          heading: "Waar de statistieken van deze site voor dienen",
          paragraphs: [
            "Frequentie- en achterstandstabellen visualiseren de lokale geschiedenis. Ze helpen de waargenomen verdeling te lezen, niet het volgende resultaat te voorspellen.",
            "De simulator controleert een gespeeld (of verzonnen) rooster tegen gepubliceerde trekkingen. Het is geen voorspellingstool.",
          ],
        },
        {
          heading: "Praktische conclusie",
          paragraphs: [
            "Als u speelt, behandel het als gebudgetteerde vrije tijd — nooit als een investering of inkomen. 18+ · risico op verlies.",
          ],
        },
      ],
    },
  },
  "jeu-responsable-euromillions": {
    it: {
      title: "Gioco responsabile e EuroMillions",
      subtitle:
        "Budget per il tempo libero, 18+, segnali d’allarme e risorse di aiuto in Francia.",
      sections: [
        {
          heading: "Regole semplici",
          paragraphs: [
            "Solo maggiorenni (18+). Fissate in anticipo un budget per il tempo libero, con denaro che potete permettervi di perdere, e non superatelo.",
            "Non inseguite mai le perdite. Un report di jackpot non è un «momento per recuperare». I giochi a estrazione comportano un rischio di perdere denaro.",
          ],
        },
        {
          heading: "Segnali d’allarme",
          paragraphs: [
            "Chiedere in prestito per giocare, nascondere le puntate, giocare per recuperare le perdite o sentire ansia intorno all’estrazione: non sono più segni di un passatempo.",
            "Statistiche, simulatori e generatori di questo sito sono strumenti di lettura. Non giustificano un aumento della puntata.",
          ],
        },
        {
          heading: "Aiuto in Francia",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "Se il gioco smette di essere un piacere, fermatevi e chiedete aiuto. Potete anche autoescludervi dai canali di gioco online autorizzati.",
          ],
        },
      ],
    },
    es: {
      title: "Juego responsable y EuroMillions",
      subtitle:
        "Presupuesto de ocio, 18+, señales de alerta y recursos de ayuda en Francia.",
      sections: [
        {
          heading: "Reglas simples",
          paragraphs: [
            "Solo mayores de edad (18+). Fija de antemano un presupuesto de ocio, con dinero que puedes permitirte perder, y no lo sobrepases.",
            "Nunca persigas las pérdidas. Una acumulación de bote no es un «momento para recuperarse». Los juegos de sorteo conllevan un riesgo de perder dinero.",
          ],
        },
        {
          heading: "Señales de alerta",
          paragraphs: [
            "Pedir prestado para jugar, ocultar las apuestas, jugar para recuperar pérdidas o sentir ansiedad en torno al sorteo: ya no son signos de ocio.",
            "Las estadísticas, simuladores y generadores de este sitio son herramientas de lectura. No justifican aumentar la apuesta.",
          ],
        },
        {
          heading: "Ayuda en Francia",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "Si el juego deja de ser un placer, para y pide ayuda. También puedes autoexcluirte de los canales de juego en línea autorizados.",
          ],
        },
      ],
    },
    pt: {
      title: "Jogo responsável e EuroMillions",
      subtitle:
        "Orçamento de lazer, 18+, sinais de alerta e recursos de ajuda em França.",
      sections: [
        {
          heading: "Regras simples",
          paragraphs: [
            "Apenas adultos (18+). Defina antecipadamente um orçamento de lazer, com dinheiro que pode perder, e não o ultrapasse.",
            "Nunca persiga as perdas. Uma acumulação de jackpot não é um «momento para recuperar». Os jogos de sorteio implicam um risco de perder dinheiro.",
          ],
        },
        {
          heading: "Sinais de alerta",
          paragraphs: [
            "Pedir emprestado para jogar, esconder as apostas, jogar para recuperar perdas ou sentir ansiedade em torno do sorteio: já não são sinais de lazer.",
            "As estatísticas, simuladores e geradores deste site são ferramentas de leitura. Não justificam aumentar a aposta.",
          ],
        },
        {
          heading: "Ajuda em França",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "Se o jogo deixar de ser um prazer, pare e peça ajuda. Também se pode autoexcluir dos canais de jogo online autorizados.",
          ],
        },
      ],
    },
    de: {
      title: "Verantwortungsvolles Spielen & EuroMillions",
      subtitle:
        "Freizeitbudget, 18+, Warnsignale und Hilfsangebote in Frankreich.",
      sections: [
        {
          heading: "Einfache Regeln",
          paragraphs: [
            "Nur Erwachsene (18+). Setzen Sie im Voraus ein Freizeitbudget fest, mit Geld, das Sie verlieren können, und überschreiten Sie es nicht.",
            "Jagen Sie niemals Verlusten hinterher. Ein Jackpot-Übertrag ist kein «Moment zum Aufholen». Ziehungsspiele bergen das Risiko, Geld zu verlieren.",
          ],
        },
        {
          heading: "Warnsignale",
          paragraphs: [
            "Leihen, um zu spielen, Einsätze verbergen, spielen um Verluste wettzumachen oder Angst rund um die Ziehung: Das sind keine Zeichen von Freizeit mehr.",
            "Statistik, Simulatoren und Generatoren auf dieser Website sind Lese-Tools. Sie rechtfertigen keine Erhöhung des Einsatzes.",
          ],
        },
        {
          heading: "Hilfe in Frankreich",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "Wenn das Spiel aufhört, Spaß zu machen, hören Sie auf und holen Sie Hilfe. Sie können sich auch von lizenzierten Online-Kanälen selbst ausschließen.",
          ],
        },
      ],
    },
    nl: {
      title: "Verantwoord spelen & EuroMillions",
      subtitle:
        "Vrijetijdsbudget, 18+, waarschuwingssignalen en hulpmiddelen in Frankrijk.",
      sections: [
        {
          heading: "Eenvoudige regels",
          paragraphs: [
            "Alleen volwassenen (18+). Stel vooraf een vrijetijdsbudget vast, met geld dat u kunt missen, en overschrijd het niet.",
            "Jaag nooit verliezen na. Een jackpotdoorschuiving is geen «moment om bij te benen». Trekkingspellen houden een risico in om geld te verliezen.",
          ],
        },
        {
          heading: "Waarschuwingssignalen",
          paragraphs: [
            "Lenen om te spelen, inzetten verbergen, spelen om verliezen goed te maken of angst rond de trekking: dat zijn geen tekenen van vrije tijd meer.",
            "Statistieken, simulatoren en generatoren op deze site zijn leestools. Ze rechtvaardigen geen hogere inzet.",
          ],
        },
        {
          heading: "Hulp in Frankrijk",
          paragraphs: [
            "Joueurs Info Service — 09 74 75 13 13 — https://www.joueurs-info-service.fr",
            "Als gokken ophoudt leuk te zijn, stop en zoek hulp. U kunt zich ook zelf uitsluiten van vergunde onlinekanalen.",
          ],
        },
      ],
    },
  },
  "comprendre-my-million": {
    it: {
      title: "My Million: leggere il codice, senza confonderlo con il jackpot",
      subtitle:
        "Codice unico per griglia francese, archivi, località dei vincitori — e ciò che questo sito mostra.",
      sections: [
        {
          heading: "Cos’è My Million",
          paragraphs: [
            "My Million è un gioco associato alle griglie EuroMillions giocate in Francia (rete FDJ). Ogni griglia riceve un codice alfanumerico. Viene estratto un codice; se coincide con il vostro, il premio My Million è distinto dal jackpot EuroMillions.",
            "Vincere My Million non dipende dai 5 numeri e dalle 2 stelle. Viceversa, un jackpot EuroMillions non «include» My Million: sono due meccanismi.",
          ],
        },
        {
          heading: "Come verificare un codice",
          paragraphs: [
            "Su questo sito, la pagina My Million elenca i codici pubblicati con la data dell’estrazione. Un campo permette di confrontare il vostro codice con l’archivio locale.",
            "La località di un vincitore (dipartimento, «Internet», ecc.) proviene da annunci pubblici (spesso il magazine FDJ). Può arrivare dopo il codice, o restare assente.",
          ],
        },
        {
          heading: "Limiti utili",
          paragraphs: [
            "Non rilasciamo codici, non convalidiamo un biglietto ufficiale e non contattiamo i vincitori. Solo l’operatore (FDJ) fa fede per un pagamento.",
            "18+ · Gioca responsabilmente. My Million resta un gioco d’azzardo: un codice che «ricompare spesso» negli archivi non ha più chance all’estrazione successiva.",
          ],
        },
      ],
    },
    es: {
      title: "My Million: leer el código, sin confundirlo con el bote",
      subtitle:
        "Código único por combinación francesa, archivos, localización de ganadores — y lo que muestra este sitio.",
      sections: [
        {
          heading: "Qué es My Million",
          paragraphs: [
            "My Million es un juego asociado a las combinaciones EuroMillions jugadas en Francia (red FDJ). Cada combinación recibe un código alfanumérico. Se extrae un código; si coincide con el tuyo, el premio My Million es independiente del bote EuroMillions.",
            "Ganar My Million no depende de los 5 números y las 2 estrellas. A la inversa, un bote EuroMillions no «incluye» My Million: son dos mecanismos.",
          ],
        },
        {
          heading: "Cómo comprobar un código",
          paragraphs: [
            "En este sitio, la página My Million lista los códigos publicados con la fecha del sorteo. Un campo permite comparar tu código con el archivo local.",
            "La localización de un ganador (departamento, «Internet», etc.) procede de anuncios públicos (a menudo la revista FDJ). Puede llegar después del código, o no publicarse.",
          ],
        },
        {
          heading: "Límites útiles",
          paragraphs: [
            "No emitimos códigos, no validamos un boleto oficial ni contactamos a los ganadores. Solo el operador (FDJ) es autoridad para un pago.",
            "18+ · Juega con responsabilidad. My Million sigue siendo un juego de azar: un código que «aparece a menudo» en el archivo no es más probable en el próximo sorteo.",
          ],
        },
      ],
    },
    pt: {
      title: "My Million: ler o código, sem o confundir com o jackpot",
      subtitle:
        "Código único por grelha francesa, arquivos, localização dos vencedores — e o que este site mostra.",
      sections: [
        {
          heading: "O que é o My Million",
          paragraphs: [
            "My Million é um jogo associado às grelhas EuroMillions jogadas em França (rede FDJ). Cada grelha recebe um código alfanumérico. É extraído um código; se coincidir com o seu, o prémio My Million é distinto do jackpot EuroMillions.",
            "Ganhar o My Million não depende dos 5 números e das 2 estrelas. Inversamente, um jackpot EuroMillions não «inclui» o My Million: são dois mecanismos.",
          ],
        },
        {
          heading: "Como verificar um código",
          paragraphs: [
            "Neste site, a página My Million lista os códigos publicados com a data do sorteio. Um campo permite comparar o seu código com o arquivo local.",
            "A localização de um vencedor (departamento, «Internet», etc.) vem de anúncios públicos (muitas vezes a revista FDJ). Pode chegar depois do código, ou ficar em falta.",
          ],
        },
        {
          heading: "Limites úteis",
          paragraphs: [
            "Não emitimos códigos, não validamos um bilhete oficial nem contactamos os vencedores. Só o operador (FDJ) faz fé para um pagamento.",
            "18+ · Jogue com responsabilidade. O My Million continua a ser um jogo de azar: um código que «aparece muitas vezes» no arquivo não tem mais hipóteses no próximo sorteio.",
          ],
        },
      ],
    },
    de: {
      title: "My Million: den Code lesen, ohne ihn mit dem Jackpot zu verwechseln",
      subtitle:
        "Eindeutiger Code pro französischem Tipp, Archiv, Gewinnerorte — und was diese Website zeigt.",
      sections: [
        {
          heading: "Was My Million ist",
          paragraphs: [
            "My Million ist ein Spiel, das an in Frankreich gespielte EuroMillions-Tipps gekoppelt ist (FDJ-Netz). Jeder Tipp erhält einen alphanumerischen Code. Ein Code wird gezogen; wenn er mit Ihrem übereinstimmt, ist der My-Million-Gewinn vom EuroMillions-Jackpot getrennt.",
            "My Million zu gewinnen hängt nicht von den 5 Zahlen und 2 Sternen ab. Umgekehrt «enthält» ein EuroMillions-Jackpot My Million nicht: Es sind zwei Mechanismen.",
          ],
        },
        {
          heading: "So prüfen Sie einen Code",
          paragraphs: [
            "Auf dieser Website listet die My-Million-Seite veröffentlichte Codes mit dem Ziehungsdatum. Ein Feld lässt Sie Ihren Code mit dem lokalen Archiv vergleichen.",
            "Der Ort eines Gewinners (Département, «Internet» usw.) stammt aus öffentlichen Bekanntgaben (oft das FDJ-Magazin). Er kann nach dem Code kommen oder ausbleiben.",
          ],
        },
        {
          heading: "Nützliche Grenzen",
          paragraphs: [
            "Wir geben keine Codes aus, validieren keinen offiziellen Tippschein und kontaktieren keine Gewinner. Nur der Betreiber (FDJ) ist für eine Auszahlung maßgeblich.",
            "18+ · Verantwortungsvoll spielen. My Million bleibt ein Glücksspiel: Ein Code, der im Archiv «oft vorkommt», ist bei der nächsten Ziehung nicht wahrscheinlicher.",
          ],
        },
      ],
    },
    nl: {
      title: "My Million: de code lezen, zonder hem met de jackpot te verwarren",
      subtitle:
        "Unieke code per Frans rooster, archieven, locaties van winnaars — en wat deze site toont.",
      sections: [
        {
          heading: "Wat My Million is",
          paragraphs: [
            "My Million is een spel gekoppeld aan EuroMillions-roosters die in Frankrijk gespeeld worden (FDJ-netwerk). Elk rooster krijgt een alfanumerieke code. Er wordt één code getrokken; als die met de uwe overeenkomt, is de My Million-prijs los van de EuroMillions-jackpot.",
            "My Million winnen hangt niet af van de 5 nummers en 2 sterren. Omgekeerd «bevat» een EuroMillions-jackpot My Million niet: het zijn twee mechanismen.",
          ],
        },
        {
          heading: "Hoe u een code controleert",
          paragraphs: [
            "Op deze site somt de My Million-pagina gepubliceerde codes op met de trekkingsdatum. Een veld laat u uw code vergelijken met het lokale archief.",
            "De locatie van een winnaar (departement, «Internet», enz.) komt uit openbare aankondigingen (vaak het FDJ-magazine). Ze kan na de code komen, of ontbreken.",
          ],
        },
        {
          heading: "Nuttige grenzen",
          paragraphs: [
            "Wij geven geen codes uit, valideren geen officieel lot en contacteren geen winnaars. Alleen de operator (FDJ) is gezaghebbend voor een uitbetaling.",
            "18+ · Speel verantwoord. My Million blijft een kansspel: een code die «vaak voorkomt» in het archief is bij de volgende trekking niet waarschijnlijker.",
          ],
        },
      ],
    },
  },
  "rangs-gains-euromillions": {
    it: {
      title: "Le 13 categorie di premio EuroMillions",
      subtitle:
        "Da 5 numeri + 2 stelle fino a 2 numeri: come leggere la tabella, senza inseguire una «categoria facile».",
      sections: [
        {
          heading: "Il principio",
          paragraphs: [
            "Una categoria corrisponde a una coppia (numeri giusti, stelle giuste). Il rango 1 è 5+2. Le categorie inferiori pagano meno e sono più frequenti.",
            "Gli importi per categoria non sono fissi come una lotteria «a premi garantiti»: dipendono dal montepremi e dal numero di vincitori. La scheda di un’estrazione, quando la fonte lo fornisce, elenca i premi constatati.",
          ],
        },
        {
          heading: "Le 13 categorie, dalla più rara alla più frequente",
          paragraphs: [
            "Rango 1: 5 numeri + 2 stelle (jackpot). Rango 2: 5+1. Rango 3: 5+0. Rango 4: 4+2. Rango 5: 4+1. Rango 6: 3+2. Rango 7: 4+0.",
            "Rango 8: 2+2. Rango 9: 3+1. Rango 10: 3+0. Rango 11: 1+2. Rango 12: 2+1. Rango 13: 2+0 (spesso la categoria più frequente, con un premio modesto).",
          ],
          bullets: [
            "5+2 — jackpot, circa 1 chance su 140 milioni",
            "2+0 — la più comune delle 13, premio basso",
            "Una sola stella, o un solo numero, non paga",
          ],
        },
        {
          heading: "Usare il simulatore",
          paragraphs: [
            "Il simulatore di questo sito confronta la vostra griglia con un’estrazione pubblicata e indica l’eventuale categoria. Serve a verificare un biglietto o a capire la tabella — non a scegliere «la categoria più redditizia».",
            "18+ · nessuna categoria è un investimento.",
          ],
        },
      ],
    },
    es: {
      title: "Las 13 categorías de premio EuroMillions",
      subtitle:
        "De 5 números + 2 estrellas hasta 2 números: cómo leer la tabla, sin perseguir una «categoría fácil».",
      sections: [
        {
          heading: "La idea",
          paragraphs: [
            "Una categoría es un par (números acertados, estrellas acertadas). El rango 1 es 5+2. Las categorías inferiores pagan menos y ocurren más a menudo.",
            "Los importes por categoría no son fijos como una lotería «de premios garantizados»: dependen del pozo y del número de ganadores. La ficha de un sorteo, cuando la fuente lo aporta, lista los premios observados.",
          ],
        },
        {
          heading: "Las 13 categorías, de la más rara a la más frecuente",
          paragraphs: [
            "Rango 1: 5 números + 2 estrellas (bote). Rango 2: 5+1. Rango 3: 5+0. Rango 4: 4+2. Rango 5: 4+1. Rango 6: 3+2. Rango 7: 4+0.",
            "Rango 8: 2+2. Rango 9: 3+1. Rango 10: 3+0. Rango 11: 1+2. Rango 12: 2+1. Rango 13: 2+0 (a menudo la categoría más frecuente, con un premio modesto).",
          ],
          bullets: [
            "5+2 — bote, unas 1 entre 140 millones",
            "2+0 — la más habitual de las 13, premio pequeño",
            "Una sola estrella, o un solo número, no paga",
          ],
        },
        {
          heading: "Usar el simulador",
          paragraphs: [
            "El simulador de este sitio compara tu combinación con un sorteo publicado e indica la categoría, si la hay. Sirve para comprobar un boleto o entender la tabla — no para elegir «la categoría más rentable».",
            "18+ · ninguna categoría es una inversión.",
          ],
        },
      ],
    },
    pt: {
      title: "Os 13 escalões de prémio EuroMillions",
      subtitle:
        "De 5 números + 2 estrelas até 2 números: como ler a tabela, sem perseguir um «escalão fácil».",
      sections: [
        {
          heading: "O princípio",
          paragraphs: [
            "Um escalão é um par (números certos, estrelas certas). O escalão 1 é 5+2. Os escalões inferiores pagam menos e ocorrem mais vezes.",
            "Os montantes por escalão não são fixos como uma lotaria «de prémios garantidos»: dependem do poço e do número de vencedores. A ficha de um sorteio, quando a fonte o fornece, lista os prémios observados.",
          ],
        },
        {
          heading: "Os 13 escalões, do mais raro ao mais frequente",
          paragraphs: [
            "Escalão 1: 5 números + 2 estrelas (jackpot). Escalão 2: 5+1. Escalão 3: 5+0. Escalão 4: 4+2. Escalão 5: 4+1. Escalão 6: 3+2. Escalão 7: 4+0.",
            "Escalão 8: 2+2. Escalão 9: 3+1. Escalão 10: 3+0. Escalão 11: 1+2. Escalão 12: 2+1. Escalão 13: 2+0 (muitas vezes o escalão mais frequente, com um prémio modesto).",
          ],
          bullets: [
            "5+2 — jackpot, cerca de 1 em 140 milhões",
            "2+0 — o mais comum dos 13, prémio baixo",
            "Uma estrela só, ou um número só, não paga",
          ],
        },
        {
          heading: "Usar o simulador",
          paragraphs: [
            "O simulador deste site compara a sua grelha com um sorteio publicado e indica o escalão, se existir. Serve para verificar um bilhete ou perceber a tabela — não para escolher «o escalão mais rentável».",
            "18+ · nenhum escalão é um investimento.",
          ],
        },
      ],
    },
    de: {
      title: "Die 13 EuroMillions-Gewinnränge",
      subtitle:
        "Von 5 Zahlen + 2 Sternen bis 2 Zahlen: so lesen Sie die Tabelle, ohne einem «leichten Rang» hinterherzulaufen.",
      sections: [
        {
          heading: "Das Prinzip",
          paragraphs: [
            "Ein Rang ist ein Paar (richtige Zahlen, richtige Sterne). Rang 1 ist 5+2. Niedrigere Ränge zahlen weniger und kommen häufiger vor.",
            "Beträge je Rang sind nicht fest wie bei einer Lotterie mit «garantierten Preisen»: Sie hängen vom Gewinnpool und der Zahl der Gewinner ab. Eine Ziehungsseite listet, wenn die Quelle sie liefert, die beobachteten Gewinne.",
          ],
        },
        {
          heading: "Die 13 Ränge, vom seltensten zum häufigsten",
          paragraphs: [
            "Rang 1: 5 Zahlen + 2 Sterne (Jackpot). Rang 2: 5+1. Rang 3: 5+0. Rang 4: 4+2. Rang 5: 4+1. Rang 6: 3+2. Rang 7: 4+0.",
            "Rang 8: 2+2. Rang 9: 3+1. Rang 10: 3+0. Rang 11: 1+2. Rang 12: 2+1. Rang 13: 2+0 (oft der häufigste Rang, mit einem bescheidenen Gewinn).",
          ],
          bullets: [
            "5+2 — Jackpot, etwa 1 zu 140 Millionen",
            "2+0 — der häufigste der 13, kleiner Gewinn",
            "Ein einzelner Stern oder eine einzelne Zahl zahlt nicht",
          ],
        },
        {
          heading: "Den Simulator nutzen",
          paragraphs: [
            "Der Simulator dieser Website vergleicht Ihren Tipp mit einer veröffentlichten Ziehung und zeigt den Rang, falls vorhanden. Das dient zur Prüfung eines Tippscheins oder zum Verstehen der Tabelle — nicht zur Wahl des «rentabelsten Rangs».",
            "18+ · kein Rang ist eine Investition.",
          ],
        },
      ],
    },
    nl: {
      title: "De 13 EuroMillions-prijscategorieën",
      subtitle:
        "Van 5 nummers + 2 sterren tot 2 nummers: hoe u de tabel leest, zonder een «makkelijke rang» na te jagen.",
      sections: [
        {
          heading: "Het principe",
          paragraphs: [
            "Een rang is een paar (juiste nummers, juiste sterren). Rang 1 is 5+2. Lagere rangen betalen minder en komen vaker voor.",
            "Bedragen per rang zijn niet vast zoals bij een loterij met «gegarandeerde prijzen»: ze hangen af van de prijzenpot en het aantal winnaars. Een trekkingspagina somt, wanneer de bron ze levert, de waargenomen prijzen op.",
          ],
        },
        {
          heading: "De 13 rangen, van zeldzaamst tot meest voorkomend",
          paragraphs: [
            "Rang 1: 5 nummers + 2 sterren (jackpot). Rang 2: 5+1. Rang 3: 5+0. Rang 4: 4+2. Rang 5: 4+1. Rang 6: 3+2. Rang 7: 4+0.",
            "Rang 8: 2+2. Rang 9: 3+1. Rang 10: 3+0. Rang 11: 1+2. Rang 12: 2+1. Rang 13: 2+0 (vaak de meest frequente rang, met een bescheiden prijs).",
          ],
          bullets: [
            "5+2 — jackpot, ongeveer 1 op 140 miljoen",
            "2+0 — de meest voorkomende van de 13, kleine prijs",
            "Een enkele ster, of een enkel nummer, betaalt niet",
          ],
        },
        {
          heading: "De simulator gebruiken",
          paragraphs: [
            "De simulator van deze site vergelijkt uw rooster met een gepubliceerde trekking en toont de rang, indien van toepassing. Dat dient om een lot te controleren of de tabel te begrijpen — niet om «de meest rendabele rang» te kiezen.",
            "18+ · geen rang is een investering.",
          ],
        },
      ],
    },
  },
  "euromillions-et-autres-tirages": {
    it: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno: le differenze",
      subtitle:
        "Stessa famiglia di estrazioni FDJ, regole distinte — ciò che questo sito mostra per ciascuno.",
      sections: [
        {
          heading: "Perché raggrupparli qui",
          paragraphs: [
            "L’EuroMillions resta il tema principale del sito. Loto, EuroDreams, Crescendo e Keno sono estrazioni FDJ i cui risultati pubblici sono utili la sera di un’estrazione, senza farne «sistemi incrociati».",
            "Ogni gioco ha la propria griglia, i propri orari e le proprie categorie. Una statistica EuroMillions non dice nulla sul Loto.",
          ],
        },
        {
          heading: "Punti di riferimento (indicativi)",
          paragraphs: [
            "EuroMillions: 5/50 + 2 stelle/12, martedì e venerdì. My Million è un codice francese associato.",
            "Loto: 5 numeri + numero Chance, diverse sere a settimana. EuroDreams: estrazione europea con un numero «Dreams» e una rendita possibile. Keno: molti numeri, estrazioni a mezzogiorno e sera. Crescendo: diverse estrazioni il sabato.",
          ],
          bullets: [
            "Gli orari esatti spettano a FDJ",
            "Gli archivi complementari sono più corti dello storico EuroMillions",
            "Ogni gioco ha il proprio simulatore e le proprie statistiche sulla pagina /jeux/…",
          ],
        },
        {
          heading: "Ciò che non facciamo",
          paragraphs: [
            "Nessun «combinato magico» tra giochi, nessuna vendita di biglietti, nessuna promessa di vincita. Per giocare: operatore legale, 18+, budget per il tempo libero.",
          ],
        },
      ],
    },
    es: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno: las diferencias",
      subtitle:
        "Misma familia de sorteos FDJ, reglas distintas — lo que este sitio muestra de cada uno.",
      sections: [
        {
          heading: "Por qué agruparlos aquí",
          paragraphs: [
            "EuroMillions sigue siendo el tema principal del sitio. Loto, EuroDreams, Crescendo y Keno son sorteos FDJ cuyos resultados públicos son útiles la noche de un sorteo, sin convertirlos en «sistemas cruzados».",
            "Cada juego tiene su propia combinación, horario y categorías. Una estadística EuroMillions no dice nada sobre el Loto.",
          ],
        },
        {
          heading: "Referencias (indicativas)",
          paragraphs: [
            "EuroMillions: 5/50 + 2 estrellas/12, martes y viernes. My Million es un código francés asociado.",
            "Loto: 5 números + número Chance, varias noches por semana. EuroDreams: sorteo europeo con un número «Dreams» y una renta posible. Keno: muchos números, sorteos de mediodía y noche. Crescendo: varios sorteos el sábado.",
          ],
          bullets: [
            "Los horarios exactos los fija FDJ",
            "Los archivos complementarios son más cortos que el historial EuroMillions",
            "Cada juego tiene su simulador y estadísticas en su página /jeux/…",
          ],
        },
        {
          heading: "Lo que no hacemos",
          paragraphs: [
            "Ningún «combinado mágico» entre juegos, ninguna venta de boletos, ninguna promesa de ganancia. Para jugar: operador legal, 18+, presupuesto de ocio.",
          ],
        },
      ],
    },
    pt: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno: as diferenças",
      subtitle:
        "Mesma família de sorteios FDJ, regras distintas — o que este site mostra para cada um.",
      sections: [
        {
          heading: "Porque os agrupar aqui",
          paragraphs: [
            "O EuroMillions continua a ser o tema principal do site. Loto, EuroDreams, Crescendo e Keno são sorteios FDJ cujos resultados públicos são úteis na noite de um sorteio, sem os transformar em «sistemas cruzados».",
            "Cada jogo tem a sua grelha, os seus horários e os seus escalões. Uma estatística EuroMillions não diz nada sobre o Loto.",
          ],
        },
        {
          heading: "Referências (indicativas)",
          paragraphs: [
            "EuroMillions: 5/50 + 2 estrelas/12, terça e sexta. My Million é um código francês associado.",
            "Loto: 5 números + número Chance, várias noites por semana. EuroDreams: sorteio europeu com um número «Dreams» e uma renda possível. Keno: muitos números, sorteios ao meio-dia e à noite. Crescendo: vários sorteios ao sábado.",
          ],
          bullets: [
            "Os horários exatos cabem à FDJ",
            "Os arquivos de acompanhamento são mais curtos do que o histórico EuroMillions",
            "Cada jogo tem o seu simulador e estatísticas na página /jeux/…",
          ],
        },
        {
          heading: "O que não fazemos",
          paragraphs: [
            "Nenhum «combinado mágico» entre jogos, nenhuma venda de bilhetes, nenhuma promessa de ganho. Para jogar: operador legal, 18+, orçamento de lazer.",
          ],
        },
      ],
    },
    de: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno: die Unterschiede",
      subtitle:
        "Dieselbe FDJ-Ziehungsfamilie, andere Regeln — was diese Website zu jedem Spiel zeigt.",
      sections: [
        {
          heading: "Warum sie hier stehen",
          paragraphs: [
            "EuroMillions bleibt das Hauptthema der Website. Loto, EuroDreams, Crescendo und Keno sind FDJ-Ziehungen, deren öffentliche Ergebnisse am Ziehungsabend nützlich sind, ohne daraus «übergreifende Systeme» zu machen.",
            "Jedes Spiel hat seinen eigenen Tipp, Zeitplan und Gewinnränge. Eine EuroMillions-Statistik sagt nichts über Loto aus.",
          ],
        },
        {
          heading: "Grobe Orientierung",
          paragraphs: [
            "EuroMillions: 5/50 + 2 Sterne/12, Dienstag und Freitag. My Million ist ein zugehöriger französischer Code.",
            "Loto: 5 Zahlen + Chance-Zahl, mehrere Abende pro Woche. EuroDreams: europäische Ziehung mit einer «Dreams»-Zahl und möglicher Rente. Keno: viele Zahlen, Mittags- und Abendziehungen. Crescendo: mehrere Samstagsziehungen.",
          ],
          bullets: [
            "Die genauen Zeiten legt FDJ fest",
            "Die Begleitarchive sind kürzer als die EuroMillions-Historie",
            "Jedes Spiel hat Simulator und Statistik auf seiner /jeux/…-Seite",
          ],
        },
        {
          heading: "Was wir nicht tun",
          paragraphs: [
            "Kein «magischer Kombi» über Spiele hinweg, kein Tippscheinverkauf, kein Gewinnversprechen. Zum Spielen: lizenzierter Betreiber, 18+, Freizeitbudget.",
          ],
        },
      ],
    },
    nl: {
      title: "EuroMillions, Loto, EuroDreams, Crescendo, Keno: de verschillen",
      subtitle:
        "Zelfde FDJ-trekkingsfamilie, andere regels — wat deze site voor elk toont.",
      sections: [
        {
          heading: "Waarom ze hier staan",
          paragraphs: [
            "EuroMillions blijft het hoofdthema van de site. Loto, EuroDreams, Crescendo en Keno zijn FDJ-trekkingen waarvan de openbare uitslagen nuttig zijn op trekkingsavond, zonder er «gekruiste systemen» van te maken.",
            "Elk spel heeft zijn eigen rooster, schema en prijscategorieën. Een EuroMillions-statistiek zegt niets over Loto.",
          ],
        },
        {
          heading: "Grove ijkpunten",
          paragraphs: [
            "EuroMillions: 5/50 + 2 sterren/12, dinsdag en vrijdag. My Million is een bijbehorende Franse code.",
            "Loto: 5 nummers + Chance-nummer, meerdere avonden per week. EuroDreams: Europese trekking met een «Dreams»-nummer en een mogelijke rente. Keno: veel nummers, middag- en avondtrekkingen. Crescendo: meerdere zaterdagtrekkingen.",
          ],
          bullets: [
            "De exacte tijden worden door FDJ vastgelegd",
            "De begeleidende archieven zijn korter dan de EuroMillions-geschiedenis",
            "Elk spel heeft zijn simulator en statistieken op de pagina /jeux/…",
          ],
        },
        {
          heading: "Wat we niet doen",
          paragraphs: [
            "Geen «magische combo» tussen spellen, geen lotenverkoop, geen belofte van winst. Om te spelen: vergunde operator, 18+, vrijetijdsbudget.",
          ],
        },
      ],
    },
  },
};
