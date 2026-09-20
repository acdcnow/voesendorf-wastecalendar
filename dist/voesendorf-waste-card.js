/**
 * voesendorf-waste-card
 * ---------------------------------------------------------------------------
 * A self-contained Lovelace card for the waste collection calendar of the
 * Austrian municipality Vösendorf (2331 Vösendorf, Lower Austria).
 *
 * Features
 *   - pick your street, the card derives your collection area ("Abfuhrgebiet")
 *   - next collections with "tomorrow"/"in 3 days" hints
 *   - full-year mini calendar, colour coded like the official PDF
 *   - OpenStreetMap map with all three areas, colour coded per street
 *   - works without any integration: the calendar data is bundled in this file
 *
 * The card is generated from src/ + data/ by tools/build_card.py - the two
 * placeholders below are replaced with the real data at build time.
 *
 * Licence: MIT. Map data (c) OpenStreetMap contributors (ODbL).
 */

const VERSION = "1.3.0";
const SCHEDULE = {"year":2026,"municipality":"Marktgemeinde Vösendorf, 2331 Vösendorf, Schlossplatz 1","sources":{"info_page":"https://voesendorf.gv.at/buergerservice/muellkalender/","pdf":"https://voesendorf.gv.at/wp-content/uploads/2021/09/Muellkalender-2026_web.pdf","street_geometry":"OpenStreetMap (ODbL) via Overpass API"},"generated":"2026-09-20","legend":{"RM":{"name":"Restmüll","short":"RM","interval":"14-tägig","description":"Restmülltonne, 14-tägige Abholung"},"RM4":{"name":"Restmüll (4-wöchig)","short":"RM4","interval":"4-wöchig","description":"Restmülltonne mit 4-wöchigem Rhythmus; wird am selben Tag wie die 14-tägige Sammlung abgeholt"},"Bio":{"name":"Biomüll","short":"Bio","interval":"14-tägig / wöchentlich","description":"14-tägig im Winter, wöchentlich vom Frühjahr bis Ende September"}},"zones":{"oberort":{"name":"Oberort","description":"Nördlicher/westlicher Ortsteil, Triester Straße, Haidfeld- und Kalesasiedlung","weekday":{"RM":"Tue","RM4":"Tue","Bio":"Wed"},"colours":{"RM":"#f0a000","RM4":"#a78bfa","Bio":"#7cb342"},"streets":["Am Haidegrund","Am Petersbach","Baslergasse","Böheimgasse","Doktor-Robert-Firneis-Straße","Dr. Karl Renner-Gasse","Dr. Pertich-Gasse","Franz Gruber-Gasse","Franz Schubert-Gasse","Franz Spiegel-Gasse","Fritz Schmerold-Gasse","Haidfeldstraße","Heinrich Tröber-Gasse","Jakob Janisch-Gasse","Karl Weiss-Gasse","Konsumstraße","Leopold Mandl-Gasse","Marktstraße","Mitterberggasse","Raimundgasse","Rossödengasse","Schweizer Gasse","Sperlinggasse","Stefan Brauneder-Gasse","Leopold Stipcak-Gasse","Triester Straße","Weinberggasse","Willi Hafenscher-Gasse","Haidfeldsiedlung","Kalesasiedlung","Roseggersiedlung"],"split_streets":{"Ortsstraße":"Badner Bahn bis Pizzeria Fontana","Schönbrunner Allee":"Pizzeria Fontana bis Badner Bahn"},"containers":[{"container":"Grünschnittcontainer","places":["Franz Spiegel-Gasse","Konsumstraße","Mitterberggasse"]}],"notes":["Kein Müllinsel-Standort im Abfuhrgebiet Oberort."],"dates":{"RM":["2026-01-13","2026-01-27","2026-02-10","2026-02-24","2026-03-10","2026-03-24","2026-04-07","2026-04-21","2026-05-05","2026-05-19","2026-06-02","2026-06-16","2026-06-30","2026-07-14","2026-07-28","2026-08-11","2026-08-25","2026-09-08","2026-09-22","2026-10-06","2026-10-20","2026-11-03","2026-11-17","2026-12-01","2026-12-15","2026-12-29"],"RM4":["2026-01-13","2026-02-10","2026-03-10","2026-04-07","2026-05-05","2026-06-02","2026-06-30","2026-07-28","2026-08-25","2026-09-22","2026-10-20","2026-11-17","2026-12-15"],"Bio":["2026-01-14","2026-01-28","2026-02-11","2026-02-25","2026-03-11","2026-03-25","2026-04-08","2026-04-22","2026-04-29","2026-05-06","2026-05-13","2026-05-20","2026-05-27","2026-06-03","2026-06-10","2026-06-17","2026-06-24","2026-07-01","2026-07-08","2026-07-15","2026-07-22","2026-07-29","2026-08-05","2026-08-12","2026-08-19","2026-08-26","2026-09-02","2026-09-09","2026-09-16","2026-09-23","2026-09-30","2026-10-14","2026-10-28","2026-11-11","2026-11-25","2026-12-09","2026-12-23"]}},"unterort":{"name":"Unterort","description":"Südöstlicher Ortsteil rund um Schlossplatz, Laxenburger Straße und Roßdorfstraße","weekday":{"RM":"Tue","RM4":"Tue","Bio":"Wed"},"colours":{"RM":"#f0a000","RM4":"#a78bfa","Bio":"#7cb342"},"streets":["Bachgasse","Birkenweg","Brunnerweg","Föhrengasse","Freiheitsstraße","Hutweidenweg","Jordanstraße","Kindbergstraße","Klausengasse","Laxenburger Straße","Lindengasse","Meisengasse","Mühlfeldgasse","Mühlgasse","Roßdorfstraße","Schlossplatz","Taubengasse","Zeisiggasse","Jordansiedlung","Tröbersiedlung"],"split_streets":{"Ortsstraße":"Pizzeria Fontana bis Laxenburger Straße","Schönbrunner Allee":"Pizzeria Fontana bis Tröbersiedlung"},"containers":[{"container":"Grünschnittcontainer","places":["Brunnerweg","Badgasse","Friedhof","Lindengasse","Schloss/Parkplatz","Schönbrunner Allee","NÖ Pflege- und Betreuungszentrum"]}],"notes":[],"dates":{"RM":["2026-01-07","2026-01-20","2026-02-03","2026-02-17","2026-03-03","2026-03-17","2026-03-31","2026-04-14","2026-04-28","2026-05-12","2026-05-26","2026-06-09","2026-06-23","2026-07-07","2026-07-21","2026-08-04","2026-08-18","2026-09-01","2026-09-15","2026-09-29","2026-10-13","2026-10-27","2026-11-10","2026-11-24","2026-12-07","2026-12-22"],"RM4":["2026-01-20","2026-02-17","2026-03-17","2026-04-14","2026-05-12","2026-06-09","2026-07-07","2026-08-04","2026-09-01","2026-09-29","2026-10-27","2026-11-24","2026-12-22"],"Bio":["2026-01-14","2026-01-28","2026-02-11","2026-02-25","2026-03-11","2026-03-25","2026-04-08","2026-04-22","2026-04-29","2026-05-06","2026-05-13","2026-05-20","2026-05-27","2026-06-03","2026-06-10","2026-06-17","2026-06-24","2026-07-01","2026-07-08","2026-07-15","2026-07-22","2026-07-29","2026-08-05","2026-08-12","2026-08-19","2026-08-26","2026-09-02","2026-09-09","2026-09-16","2026-09-23","2026-09-30","2026-10-14","2026-10-28","2026-11-11","2026-11-25","2026-12-09","2026-12-23"]}},"seepark":{"name":"Seepark","description":"Seeparksiedlung im Südosten (Seeparkstraße, Strandstraße, Seeweg)","weekday":{"RM":"Mon","RM4":"Mon","Bio":"Tue"},"colours":{"RM":"#f0a000","RM4":"#a78bfa","Bio":"#7cb342"},"streets":["Fischerstraße","Seeparkstraße","Seeweg","Strandstraße","Zum Anningerblick","Seeparksiedlung"],"split_streets":{},"containers":[{"container":"Grünschnittcontainer","places":["Seepark/Spitz"]},{"container":"Müllinseln","places":["Benyasiedlung"]},{"container":"Grünschnittcontainer Benyasiedlung","places":["Neuer Standort folgt 2026"]}],"notes":["Die Gemeinde-Website nennt das Seepark-Viertel noch nicht; dort ist die Seeparksiedlung nicht als eigenes Abfuhrgebiet angeführt.","Die Benyasiedlung (Anton-Benya-Straße) wird auf der Seepark-Seite des Kalenders nur wegen der Müllinseln genannt - laut Gemeinde-Website zählt die Anton-Benya-Straße zum Abfuhrgebiet Oberort."],"dates":{"RM":["2026-01-05","2026-01-19","2026-02-02","2026-02-16","2026-03-02","2026-03-16","2026-03-30","2026-04-13","2026-04-27","2026-05-11","2026-05-26","2026-06-08","2026-06-22","2026-07-06","2026-07-20","2026-08-03","2026-08-17","2026-08-31","2026-09-14","2026-09-28","2026-10-12","2026-10-27","2026-11-09","2026-11-23","2026-12-07","2026-12-21"],"RM4":["2026-01-05","2026-02-02","2026-03-02","2026-03-30","2026-04-27","2026-05-26","2026-06-22","2026-07-20","2026-08-17","2026-09-14","2026-10-12","2026-11-09","2026-12-07"],"Bio":["2026-01-13","2026-01-27","2026-02-10","2026-02-24","2026-03-10","2026-03-24","2026-04-07","2026-04-21","2026-04-28","2026-05-05","2026-05-12","2026-05-19","2026-05-26","2026-06-02","2026-06-09","2026-06-16","2026-06-23","2026-06-30","2026-07-07","2026-07-14","2026-07-21","2026-07-28","2026-08-04","2026-08-11","2026-08-18","2026-08-25","2026-09-01","2026-09-08","2026-09-15","2026-09-22","2026-09-29","2026-10-13","2026-10-27","2026-11-10","2026-11-24","2026-12-09","2026-12-22"]}}},"holidays":[{"date":"2026-01-01","name":"Neujahr"},{"date":"2026-01-06","name":"Heilige Drei Könige"},{"date":"2026-04-03","name":"Karfreitag"},{"date":"2026-04-06","name":"Ostermontag"},{"date":"2026-05-01","name":"Staatsfeiertag"},{"date":"2026-05-14","name":"Christi Himmelfahrt"},{"date":"2026-05-25","name":"Pfingstmontag"},{"date":"2026-06-04","name":"Fronleichnam"},{"date":"2026-10-26","name":"Nationalfeiertag"},{"date":"2026-11-01","name":"Allerheiligen"},{"date":"2026-12-08","name":"Mariä Empfängnis"},{"date":"2026-12-25","name":"Christtag"},{"date":"2026-12-26","name":"Stefanitag"}],"no_collection_hints":[{"date":"2026-02-17","name":"Faschingsdienstag"},{"date":"2026-11-02","name":"Allerseelen"},{"date":"2026-11-15","name":"Leopolditag"},{"date":"2026-12-24","name":"Heiliger Abend"},{"date":"2026-12-31","name":"Silvester"}],"extras":{"asz":{"name":"Altstoffsammelzentrum (ASZ)","hours":{"Montag bis Donnerstag":"10:00 - 15:00","Freitag":"10:00 - 12:00","Samstag":"08:00 - 12:00"},"note":"Letzte Einfahrt 15 Minuten vor Betriebsschluss. Ohne Entsorgungskarte und nur für Vösendorfer Haushalte.","closed":[{"date":"2026-02-17","label":"Faschingsdienstag"},{"date":"2026-04-03","label":"Karfreitag"},{"date":"2026-11-02","label":"Allerseelen"},{"date":"2026-11-15","label":"Leopolditag"},{"date":"2026-12-24","label":"Heiliger Abend"},{"date":"2026-12-31","label":"Silvester"}],"closed_note":"und an allen gesetzlichen Feiertagen"},"sperrmuell":{"name":"Sperrmüllabholung","note":"Einmal pro Jahr nach telefonischer Terminvereinbarung unter 01/699 03-35, Abholung an der Grundstücksgrenze.","not_collected":["Bauschutt","Flüssigkeiten/Problemstoffe","Grünschnitt","Plastik","Kartonagen","Sperrmüll von Mehrparteienhäusern"]},"blumenerde":{"name":"Blumenerde-Aktion 2026","events":[{"date":"2026-04-11","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung"},{"date":"2026-05-09","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung"},{"date":"2026-04-18","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung","replacement":true},{"date":"2026-05-16","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung","replacement":true}]}}};
const STREETS = {"type":"FeatureCollection","name":"voesendorf-abfuhrgebiete","attribution":"© OpenStreetMap contributors (ODbL), via Overpass API","features":[{"type":"Feature","properties":{"kind":"street","street":"Am Haidegrund","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.327705,48.137215],[16.326964,48.135799]]}},{"type":"Feature","properties":{"kind":"street","street":"Am Petersbach","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.319316,48.123654],[16.319511,48.124412]]}},{"type":"Feature","properties":{"kind":"street","street":"Baslergasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.324798,48.132496],[16.323835,48.132734]]}},{"type":"Feature","properties":{"kind":"street","street":"Baslergasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.319215,48.127371],[16.319928,48.127196]]}},{"type":"Feature","properties":{"kind":"street","street":"Böheimgasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.331244,48.136545],[16.328966,48.136993],[16.327705,48.137215]]}},{"type":"Feature","properties":{"kind":"street","street":"Doktor-Robert-Firneis-Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326666,48.128967],[16.325547,48.126674],[16.324989,48.12558],[16.324793,48.12512],[16.324627,48.124596]]}},{"type":"Feature","properties":{"kind":"street","street":"Doktor-Robert-Firneis-Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326666,48.128967],[16.326831,48.129162]]}},{"type":"Feature","properties":{"kind":"street","street":"Doktor-Robert-Firneis-Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326694,48.129188],[16.326666,48.128967]]}},{"type":"Feature","properties":{"kind":"street","street":"Dr. Karl Renner-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.321213,48.126848],[16.320975,48.126904],[16.320056,48.125112]]}},{"type":"Feature","properties":{"kind":"street","street":"Dr. Karl Renner-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.322472,48.126613],[16.321461,48.126837],[16.321301,48.126827],[16.321213,48.126848]]}},{"type":"Feature","properties":{"kind":"street","street":"Dr. Pertich-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.32348,48.130071],[16.325587,48.133945],[16.325804,48.13399]]}},{"type":"Feature","properties":{"kind":"street","street":"Franz Gruber-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326529,48.134098],[16.326963,48.134157],[16.32997,48.13355]]}},{"type":"Feature","properties":{"kind":"street","street":"Franz Schubert-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328297,48.129794],[16.327578,48.129932],[16.32699,48.129859]]}},{"type":"Feature","properties":{"kind":"street","street":"Franz Spiegel-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.329552,48.132816],[16.327338,48.133264],[16.32674,48.133402],[16.326282,48.134962],[16.326202,48.135128]]}},{"type":"Feature","properties":{"kind":"street","street":"Franz Spiegel-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326202,48.135128],[16.326219,48.135213],[16.3262,48.135303],[16.326208,48.135372],[16.326468,48.135908]]}},{"type":"Feature","properties":{"kind":"street","street":"Fritz Schmerold-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326468,48.135908],[16.326784,48.135839]]}},{"type":"Feature","properties":{"kind":"street","street":"Fritz Schmerold-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326468,48.135908],[16.326043,48.135992]]}},{"type":"Feature","properties":{"kind":"street","street":"Fritz Schmerold-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.32832,48.135521],[16.330544,48.135071]]}},{"type":"Feature","properties":{"kind":"street","street":"Fritz Schmerold-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326964,48.135799],[16.32832,48.135521]]}},{"type":"Feature","properties":{"kind":"street","street":"Fritz Schmerold-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326784,48.135839],[16.326964,48.135799]]}},{"type":"Feature","properties":{"kind":"street","street":"Haidfeldstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.32667,48.131753],[16.32683,48.132193],[16.327063,48.132717],[16.327214,48.13299],[16.32745,48.133525],[16.327547,48.133789],[16.328,48.134765]]}},{"type":"Feature","properties":{"kind":"street","street":"Haidfeldstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328,48.134765],[16.328102,48.134982],[16.328194,48.135258],[16.32832,48.135521]]}},{"type":"Feature","properties":{"kind":"street","street":"Haidfeldstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.32832,48.135521],[16.328824,48.136597],[16.328905,48.136859],[16.328966,48.136993]]}},{"type":"Feature","properties":{"kind":"street","street":"Heinrich Tröber-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.325523,48.135005],[16.326068,48.135074],[16.326146,48.135091],[16.326202,48.135128]]}},{"type":"Feature","properties":{"kind":"street","street":"Heinrich Tröber-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328,48.134765],[16.326202,48.135128]]}},{"type":"Feature","properties":{"kind":"street","street":"Heinrich Tröber-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328,48.134765],[16.330306,48.134307]]}},{"type":"Feature","properties":{"kind":"street","street":"Jakob Janisch-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328671,48.136262],[16.330939,48.135817]]}},{"type":"Feature","properties":{"kind":"street","street":"Karl Weiss-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328642,48.130544],[16.327342,48.130805],[16.32676,48.130738]]}},{"type":"Feature","properties":{"kind":"street","street":"Konsumstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.324137,48.129902],[16.322805,48.13025]]}},{"type":"Feature","properties":{"kind":"street","street":"Konsumstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326284,48.129385],[16.324137,48.129902]]}},{"type":"Feature","properties":{"kind":"street","street":"Konsumstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326284,48.129385],[16.326624,48.129259]]}},{"type":"Feature","properties":{"kind":"street","street":"Konsumstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326658,48.129372],[16.326284,48.129385]]}},{"type":"Feature","properties":{"kind":"street","street":"Konsumstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.322805,48.13025],[16.321959,48.130447]]}},{"type":"Feature","properties":{"kind":"street","street":"Leopold Mandl-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328327,48.125269],[16.328026,48.125249],[16.327551,48.125371]]}},{"type":"Feature","properties":{"kind":"street","street":"Marktstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.324137,48.129902],[16.321986,48.125634],[16.321825,48.124956]]}},{"type":"Feature","properties":{"kind":"street","street":"Marktstraße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.321825,48.124956],[16.32181,48.124889]]}},{"type":"Feature","properties":{"kind":"street","street":"Mitterberggasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.320471,48.121798],[16.320278,48.121721],[16.32008,48.121671],[16.318826,48.121391],[16.318196,48.121456]]}},{"type":"Feature","properties":{"kind":"street","street":"Mitterberggasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.322254,48.121851],[16.320471,48.121798]]}},{"type":"Feature","properties":{"kind":"street","street":"Raimundgasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.328973,48.131302],[16.32667,48.131753]]}},{"type":"Feature","properties":{"kind":"street","street":"Rossödengasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318599,48.122984],[16.320675,48.122756]]}},{"type":"Feature","properties":{"kind":"street","street":"Schweizer Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.323939,48.130897],[16.322679,48.131202]]}},{"type":"Feature","properties":{"kind":"street","street":"Sperlinggasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.322966,48.131133],[16.323835,48.132734]]}},{"type":"Feature","properties":{"kind":"street","street":"Stefan Brauneder-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.329302,48.132056],[16.326974,48.132517]]}},{"type":"Feature","properties":{"kind":"street","street":"Leopold Stipcak-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318395,48.122266],[16.320501,48.122031]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.325197,48.136311],[16.325424,48.13662]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318999,48.125552],[16.319143,48.125813]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316492,48.11625],[16.316698,48.116976],[16.316974,48.118306]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315794,48.114433],[16.315615,48.113871],[16.315501,48.113424]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315501,48.113424],[16.315478,48.113348]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315417,48.107487],[16.315346,48.110993],[16.315363,48.111693]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.325107,48.136178],[16.325197,48.136311]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.31527,48.110699],[16.315313,48.108553],[16.315289,48.107802]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316084,48.115143],[16.31598,48.115015],[16.315794,48.114433]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316084,48.115143],[16.316145,48.115333]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.323947,48.134408],[16.324287,48.134928]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.324287,48.134928],[16.32441,48.135118]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.321948,48.130965],[16.322066,48.131195]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.324543,48.135319],[16.324667,48.135514]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.325424,48.13662],[16.325855,48.137183]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.319787,48.126928],[16.319928,48.127196]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.321693,48.130494],[16.321793,48.130674]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.32441,48.135118],[16.324543,48.135319]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.319928,48.127196],[16.320814,48.128844]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.320814,48.128844],[16.321693,48.130494]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.324667,48.135514],[16.324738,48.13562]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.319143,48.125813],[16.319494,48.12642]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.322947,48.132835],[16.323754,48.134109]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.322066,48.131195],[16.322947,48.132835]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.325855,48.137183],[16.325978,48.137342]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.317212,48.11948],[16.317273,48.119774]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.317978,48.122439],[16.318116,48.12296]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318116,48.12296],[16.318242,48.123417]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.317273,48.119774],[16.317463,48.120535]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318999,48.125552],[16.318696,48.124907],[16.318532,48.124443]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315665,48.113363],[16.316106,48.114995],[16.316084,48.115143]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315478,48.113348],[16.315363,48.11287],[16.315289,48.112412],[16.315254,48.11175],[16.315267,48.111052]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315267,48.111052],[16.31527,48.110699]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315363,48.111693],[16.315412,48.112185],[16.315461,48.112453]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315289,48.107802],[16.315288,48.107729]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.315461,48.112453],[16.315665,48.113363]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.317463,48.120535],[16.317978,48.122439]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318326,48.123718],[16.318532,48.124443]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.318242,48.123417],[16.318326,48.123718]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.31975,48.126858],[16.319787,48.126928]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.321793,48.130674],[16.321948,48.130965]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.323754,48.134109],[16.323947,48.134408]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.325107,48.136178],[16.324738,48.13562]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.326303,48.137747],[16.325978,48.137342]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316974,48.118306],[16.317212,48.11948]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316145,48.115333],[16.316231,48.115567]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.319494,48.12642],[16.31975,48.126858]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316335,48.115843],[16.316492,48.11625]]}},{"type":"Feature","properties":{"kind":"street","street":"Triester Straße","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.316231,48.115567],[16.316335,48.115843]]}},{"type":"Feature","properties":{"kind":"street","street":"Weinberggasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.31879,48.123715],[16.320866,48.123489]]}},{"type":"Feature","properties":{"kind":"street","street":"Willi Hafenscher-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.320471,48.121798],[16.320501,48.122031],[16.320675,48.122756],[16.320866,48.123489],[16.320949,48.123737]]}},{"type":"Feature","properties":{"kind":"street","street":"Willi Hafenscher-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.320967,48.123801],[16.321171,48.124646]]}},{"type":"Feature","properties":{"kind":"street","street":"Willi Hafenscher-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.320949,48.123737],[16.320967,48.123801]]}},{"type":"Feature","properties":{"kind":"street","street":"Willi Hafenscher-Gasse","zone":"oberort"},"geometry":{"type":"LineString","coordinates":[[16.321171,48.124646],[16.321239,48.12494]]}},{"type":"Feature","properties":{"kind":"street","street":"Bachgasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.342952,48.119731],[16.343059,48.119911]]}},{"type":"Feature","properties":{"kind":"street","street":"Bachgasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.346981,48.118758],[16.347257,48.118703],[16.348023,48.118646],[16.348579,48.118658],[16.348663,48.118881]]}},{"type":"Feature","properties":{"kind":"street","street":"Bachgasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.343059,48.119911],[16.344676,48.119493],[16.344979,48.119456],[16.345346,48.119375],[16.34655,48.11889],[16.346981,48.118758]]}},{"type":"Feature","properties":{"kind":"street","street":"Birkenweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.336548,48.120011],[16.336322,48.119546]]}},{"type":"Feature","properties":{"kind":"street","street":"Birkenweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.336548,48.120011],[16.336729,48.120405]]}},{"type":"Feature","properties":{"kind":"street","street":"Brunnerweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.330291,48.118627],[16.330093,48.118637]]}},{"type":"Feature","properties":{"kind":"street","street":"Brunnerweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.336548,48.120011],[16.335755,48.119848],[16.334782,48.119784]]}},{"type":"Feature","properties":{"kind":"street","street":"Brunnerweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.329042,48.11845],[16.32714,48.117839],[16.32709,48.117799],[16.327002,48.11758]]}},{"type":"Feature","properties":{"kind":"street","street":"Brunnerweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.330093,48.118637],[16.329888,48.118637],[16.329042,48.11845]]}},{"type":"Feature","properties":{"kind":"street","street":"Brunnerweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.331844,48.118379],[16.330562,48.118603],[16.330291,48.118627]]}},{"type":"Feature","properties":{"kind":"street","street":"Brunnerweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.331999,48.1184],[16.331844,48.118379]]}},{"type":"Feature","properties":{"kind":"street","street":"Föhrengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.337727,48.119049],[16.337973,48.119448],[16.337098,48.11969],[16.336861,48.119329]]}},{"type":"Feature","properties":{"kind":"street","street":"Föhrengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.338109,48.119321],[16.337926,48.11937]]}},{"type":"Feature","properties":{"kind":"street","street":"Föhrengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.337176,48.119824],[16.337098,48.11969]]}},{"type":"Feature","properties":{"kind":"street","street":"Freiheitsstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.32959,48.119589],[16.329919,48.120301],[16.330007,48.120432],[16.330166,48.120591],[16.33057,48.120908]]}},{"type":"Feature","properties":{"kind":"street","street":"Freiheitsstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.329042,48.11845],[16.327894,48.116134]]}},{"type":"Feature","properties":{"kind":"street","street":"Freiheitsstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.331323,48.122195],[16.331472,48.122028]]}},{"type":"Feature","properties":{"kind":"street","street":"Freiheitsstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.331472,48.122028],[16.331557,48.122243]]}},{"type":"Feature","properties":{"kind":"street","street":"Freiheitsstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.33057,48.120908],[16.331599,48.121767],[16.331472,48.122028]]}},{"type":"Feature","properties":{"kind":"street","street":"Hutweidenweg","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.326706,48.116886],[16.326698,48.116944],[16.327002,48.11758]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.330963,48.123915],[16.331257,48.124504]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.340063,48.123282],[16.341462,48.123135]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.341462,48.123135],[16.341637,48.123088]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.341792,48.123046],[16.343374,48.122601]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.343374,48.122601],[16.344598,48.122284]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.341637,48.123088],[16.341792,48.123046]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.332101,48.124447],[16.334426,48.124012],[16.339318,48.123381]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.331257,48.124504],[16.331442,48.124554],[16.332101,48.124447]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.330934,48.123837],[16.330963,48.123915]]}},{"type":"Feature","properties":{"kind":"street","street":"Jordanstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.339318,48.123381],[16.340063,48.123282]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.335247,48.113262],[16.33527,48.113298]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.338499,48.118833],[16.338825,48.119437]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.338893,48.119558],[16.339373,48.120544]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.335149,48.112883],[16.335247,48.113262]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.33714,48.116416],[16.337583,48.117229],[16.338499,48.118833]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.338825,48.119437],[16.338893,48.119558]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.335025,48.113087],[16.335205,48.113137]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.335247,48.113262],[16.33497,48.113184]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.33527,48.113298],[16.335904,48.114314]]}},{"type":"Feature","properties":{"kind":"street","street":"Kindbergstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.335904,48.114314],[16.336536,48.115415],[16.33714,48.116416]]}},{"type":"Feature","properties":{"kind":"street","street":"Klausengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.331599,48.121767],[16.334629,48.120932],[16.336938,48.120357],[16.337006,48.12041],[16.337111,48.120446],[16.33751,48.120471],[16.339373,48.120544],[16.339489,48.120568],[16.340555,48.120563]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352703,48.117418],[16.353529,48.116309],[16.354061,48.115702],[16.354252,48.115444],[16.354506,48.115033],[16.354541,48.114931]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.350225,48.105773],[16.350229,48.105656],[16.350396,48.10517],[16.350413,48.105064]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354983,48.130079],[16.355051,48.130208],[16.35508,48.130407]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.351852,48.109277],[16.351819,48.109333],[16.351823,48.109563]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354983,48.130079],[16.354976,48.129538],[16.35503,48.129339]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.350168,48.106412],[16.350282,48.106744]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354981,48.130806],[16.35494,48.130403]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.35494,48.130403],[16.354931,48.13021],[16.354983,48.130079]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.351823,48.109563],[16.352055,48.110047],[16.35273,48.111258],[16.352956,48.111739],[16.353752,48.113273],[16.354169,48.114015]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.351823,48.109563],[16.351714,48.109345],[16.35167,48.109301]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.351344,48.10869],[16.351645,48.109002],[16.351718,48.109027]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.351558,48.109079],[16.351546,48.109025],[16.351359,48.108759],[16.351344,48.10869]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.350225,48.105773],[16.350168,48.106092],[16.350154,48.106259],[16.350168,48.106412]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.3506,48.10507],[16.350488,48.10518],[16.350354,48.105469],[16.350288,48.105664],[16.350225,48.105773]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352483,48.117769],[16.352368,48.117751]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352524,48.117531],[16.352623,48.117585]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352395,48.117533],[16.352524,48.117531]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352298,48.117594],[16.352395,48.117533]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352368,48.117751],[16.352292,48.117691],[16.35228,48.117652],[16.352298,48.117594]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352703,48.117418],[16.352623,48.117585]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352524,48.117531],[16.352703,48.117418]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352483,48.117769],[16.352395,48.117847]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352623,48.117585],[16.352647,48.117631],[16.352628,48.117703],[16.352553,48.117755],[16.352483,48.117769]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.352395,48.117847],[16.352368,48.117751]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354578,48.114669],[16.35459,48.114828],[16.354541,48.114931]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354541,48.114931],[16.354474,48.114771],[16.35443,48.114733]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354301,48.114213],[16.354372,48.114266],[16.354468,48.114477]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354315,48.114486],[16.354301,48.114213]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.350282,48.106744],[16.350808,48.107757],[16.351344,48.10869]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.35508,48.130407],[16.355179,48.131066]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354169,48.114015],[16.354239,48.114121]]}},{"type":"Feature","properties":{"kind":"street","street":"Laxenburger Straße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.354239,48.114121],[16.354301,48.114213]]}},{"type":"Feature","properties":{"kind":"street","street":"Lindengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.338222,48.11891],[16.337071,48.119233],[16.336861,48.119329],[16.336372,48.119465]]}},{"type":"Feature","properties":{"kind":"street","street":"Lindengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.338222,48.11891],[16.338499,48.118833]]}},{"type":"Feature","properties":{"kind":"street","street":"Meisengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.326706,48.116886],[16.326752,48.116861],[16.328111,48.11656]]}},{"type":"Feature","properties":{"kind":"street","street":"Mühlfeldgasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.330685,48.12072],[16.330823,48.120705],[16.334529,48.119901]]}},{"type":"Feature","properties":{"kind":"street","street":"Mühlgasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.329926,48.122047],[16.331323,48.122195],[16.331557,48.122243],[16.33231,48.122605],[16.332397,48.122678],[16.332891,48.12321]]}},{"type":"Feature","properties":{"kind":"street","street":"Roßdorfstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.342602,48.118202],[16.341946,48.11835],[16.340631,48.11877],[16.340167,48.118955]]}},{"type":"Feature","properties":{"kind":"street","street":"Roßdorfstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.336938,48.120357],[16.337837,48.119937],[16.338893,48.119558]]}},{"type":"Feature","properties":{"kind":"street","street":"Roßdorfstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.345802,48.118395],[16.345744,48.117987]]}},{"type":"Feature","properties":{"kind":"street","street":"Roßdorfstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.345744,48.117987],[16.345635,48.117951],[16.345519,48.117951],[16.34449,48.118077],[16.343478,48.118087],[16.343089,48.118119],[16.342602,48.118202]]}},{"type":"Feature","properties":{"kind":"street","street":"Roßdorfstraße","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.340167,48.118955],[16.338893,48.119558]]}},{"type":"Feature","properties":{"kind":"street","street":"Schlossplatz","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.343742,48.120954],[16.343531,48.120781],[16.343367,48.120543],[16.343277,48.120316]]}},{"type":"Feature","properties":{"kind":"street","street":"Schlossplatz","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.343059,48.119911],[16.343132,48.120044]]}},{"type":"Feature","properties":{"kind":"street","street":"Schlossplatz","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.343233,48.12023],[16.343132,48.120044]]}},{"type":"Feature","properties":{"kind":"street","street":"Schlossplatz","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.343277,48.120316],[16.343233,48.12023]]}},{"type":"Feature","properties":{"kind":"street","street":"Taubengasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.329341,48.120826],[16.330166,48.120591]]}},{"type":"Feature","properties":{"kind":"street","street":"Zeisiggasse","zone":"unterort"},"geometry":{"type":"LineString","coordinates":[[16.328455,48.117248],[16.327002,48.11758]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348889,48.1103],[16.348656,48.110729]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348771,48.108716],[16.349383,48.108776]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349292,48.109189],[16.349352,48.108837],[16.349383,48.108776]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348242,48.111534],[16.348101,48.111843]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.350108,48.108858],[16.349852,48.108722],[16.349738,48.108697],[16.349474,48.108741],[16.349383,48.108776]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348889,48.1103],[16.349292,48.109189]]}},{"type":"Feature","properties":{"kind":"street","street":"Fischerstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348656,48.110729],[16.348242,48.111534]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeparkstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348889,48.1103],[16.349026,48.110297],[16.349148,48.110259],[16.349228,48.110178],[16.349299,48.110055],[16.34953,48.109827],[16.349661,48.109729],[16.34984,48.109635],[16.350144,48.109523],[16.350627,48.109406]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeparkstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349938,48.10676],[16.351329,48.109261]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeparkstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.351558,48.109254],[16.351329,48.109261]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeparkstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.351329,48.109261],[16.351375,48.109222],[16.351515,48.109166]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeparkstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.350627,48.109406],[16.351329,48.109261]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeweg","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348101,48.111843],[16.347875,48.112147],[16.347867,48.112188]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeweg","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349945,48.116548],[16.348543,48.113984],[16.348591,48.113914],[16.34868,48.113838]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeweg","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.347867,48.112188],[16.34868,48.113838]]}},{"type":"Feature","properties":{"kind":"street","street":"Seeweg","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349986,48.116584],[16.349945,48.116548]]}},{"type":"Feature","properties":{"kind":"street","street":"Strandstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.34984,48.110131],[16.350068,48.109963],[16.350201,48.109898],[16.350376,48.109838],[16.350783,48.109759]]}},{"type":"Feature","properties":{"kind":"street","street":"Strandstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.350569,48.111069],[16.350918,48.111162],[16.351187,48.111194],[16.351413,48.111198],[16.351485,48.111154],[16.351504,48.111009],[16.351819,48.110933]]}},{"type":"Feature","properties":{"kind":"street","street":"Strandstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.350627,48.109406],[16.350474,48.109206],[16.350245,48.108971],[16.350108,48.108858]]}},{"type":"Feature","properties":{"kind":"street","street":"Strandstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349303,48.110575],[16.349752,48.110998],[16.350159,48.111319]]}},{"type":"Feature","properties":{"kind":"street","street":"Strandstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.350162,48.110735],[16.349928,48.110737],[16.349597,48.110858]]}},{"type":"Feature","properties":{"kind":"street","street":"Strandstraße","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.348101,48.111843],[16.348278,48.111869],[16.349026,48.11171],[16.349452,48.111598],[16.350071,48.111343],[16.35034,48.11127],[16.350569,48.111069],[16.35078,48.110643],[16.350845,48.110275],[16.350803,48.109833],[16.350771,48.109722],[16.350627,48.109406]]}},{"type":"Feature","properties":{"kind":"street","street":"Zum Anningerblick","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349292,48.109189],[16.349545,48.109172],[16.349834,48.109069],[16.349965,48.108994],[16.350078,48.108906],[16.350108,48.108858]]}},{"type":"Feature","properties":{"kind":"street","street":"Zum Anningerblick","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349967,48.106718],[16.350113,48.106462],[16.350168,48.106412]]}},{"type":"Feature","properties":{"kind":"street","street":"Zum Anningerblick","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.349938,48.10676],[16.349967,48.106718]]}},{"type":"Feature","properties":{"kind":"street","street":"Zum Anningerblick","zone":"seepark"},"geometry":{"type":"LineString","coordinates":[[16.350108,48.108858],[16.350195,48.108718],[16.350236,48.108553],[16.350241,48.108394],[16.350177,48.108196],[16.350072,48.108016],[16.349916,48.107842],[16.34967,48.107671],[16.34945,48.107555],[16.349938,48.10676]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.318999,48.125552],[16.319125,48.125414],[16.319211,48.125359],[16.319842,48.125159]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.32835,48.124494],[16.327815,48.124477]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.321053,48.124959],[16.320553,48.125018],[16.319842,48.125159]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.32181,48.124889],[16.321477,48.124919]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.32328,48.124786],[16.32259,48.124834]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.325756,48.124461],[16.324627,48.124596]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.327815,48.124477],[16.32683,48.124443],[16.325756,48.124461]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.321239,48.12494],[16.321053,48.124959]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.324627,48.124596],[16.324,48.124685]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.324,48.124685],[16.323558,48.124749]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.323558,48.124749],[16.32328,48.124786]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.32259,48.124834],[16.32181,48.124889]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.321477,48.124919],[16.321239,48.12494]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.355257,48.114136],[16.355007,48.114348]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.353907,48.114907],[16.349986,48.116584]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.346597,48.11804],[16.345802,48.118395],[16.344741,48.119006],[16.344279,48.119218],[16.343154,48.119667],[16.342002,48.119973],[16.341573,48.120111],[16.341232,48.120249]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.348436,48.117247],[16.346597,48.11804]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328404,48.124495],[16.32835,48.124494]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.335965,48.122593],[16.335212,48.122741],[16.33404,48.12302],[16.332891,48.12321]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.349986,48.116584],[16.348436,48.117247]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.338073,48.12204],[16.335965,48.122593]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.354358,48.114729],[16.354043,48.114868],[16.353972,48.114874]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.340701,48.120486],[16.340555,48.120563]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.330789,48.123882],[16.329943,48.124131],[16.329214,48.12432]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.332891,48.12321],[16.332555,48.123294],[16.330789,48.123882]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.353972,48.114874],[16.354243,48.114674]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.353972,48.114874],[16.353907,48.114907]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.354523,48.114495],[16.354915,48.114419]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.354915,48.114419],[16.354605,48.114612]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.341232,48.120249],[16.340701,48.120486]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.340555,48.120563],[16.340561,48.120608],[16.34088,48.121153]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.340839,48.121277],[16.340505,48.120661],[16.3405,48.120618],[16.340555,48.120563]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328552,48.124499],[16.329214,48.12432]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328552,48.124499],[16.328404,48.124495]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.340839,48.121277],[16.340779,48.121317],[16.338654,48.12188]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.338654,48.12188],[16.338073,48.12204]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.34088,48.121153],[16.340922,48.121247],[16.340839,48.121277]]}},{"type":"Feature","properties":{"kind":"street","street":"Ortsstraße","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.355007,48.114348],[16.354915,48.114419]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326658,48.129372],[16.326624,48.129322],[16.326624,48.129259]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.32542,48.135352],[16.325523,48.135005]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.328707,48.128276],[16.327661,48.128482],[16.32755,48.128521],[16.327451,48.128581],[16.327352,48.128672],[16.327295,48.128765],[16.327241,48.128934]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.329197,48.127739],[16.328297,48.125635],[16.328286,48.125502],[16.328356,48.125163]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.325552,48.134898],[16.325725,48.134284]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.327014,48.129289],[16.326975,48.129375]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.325523,48.135005],[16.325552,48.134898]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.325725,48.134284],[16.326111,48.133007],[16.326306,48.132273],[16.326951,48.130059],[16.32699,48.129859],[16.326981,48.129716]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326624,48.129259],[16.326694,48.129188]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326831,48.129162],[16.326869,48.129166]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326869,48.129166],[16.326937,48.129188]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326694,48.129188],[16.326831,48.129162]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326786,48.129423],[16.326658,48.129372]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326975,48.129375],[16.326873,48.12942],[16.326786,48.129423]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326937,48.129188],[16.327001,48.129246],[16.327014,48.129289]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326975,48.129375],[16.326963,48.129425],[16.326998,48.129613],[16.326981,48.129716]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326937,48.129188],[16.327099,48.129109],[16.327241,48.128934]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.326981,48.129716],[16.326786,48.129423]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.327241,48.128934],[16.327238,48.129011],[16.327192,48.129138],[16.327149,48.129194],[16.327014,48.129289]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.329216,48.128223],[16.328707,48.128276]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.329197,48.127739],[16.329291,48.127863],[16.329367,48.128017]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.328707,48.128276],[16.329181,48.128152]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.329269,48.128039],[16.329216,48.127884],[16.329197,48.127739]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"oberort","shared":true,"part":"Badner Bahn bis Pizzeria Fontana"},"geometry":{"type":"LineString","coordinates":[[16.328497,48.124672],[16.328356,48.125163]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328552,48.124499],[16.328865,48.123911]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.329011,48.123659],[16.330624,48.120818]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328968,48.123729],[16.329011,48.123659]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.338833,48.106472],[16.338691,48.106706],[16.338679,48.106802],[16.338952,48.106957]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.331554,48.119167],[16.331917,48.118538]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.335025,48.113087],[16.335149,48.112883]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.331999,48.1184],[16.332625,48.117306]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.331917,48.118538],[16.331999,48.1184]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.330624,48.120818],[16.331554,48.119167]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.334753,48.113566],[16.33497,48.113184]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.335149,48.112883],[16.335708,48.111919]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.33497,48.113184],[16.335025,48.113087]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.332625,48.117306],[16.334753,48.113566]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.335708,48.111919],[16.335876,48.111632]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328552,48.124499],[16.328497,48.124672]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.328865,48.123911],[16.328968,48.123729]]}},{"type":"Feature","properties":{"kind":"street","street":"Schönbrunner Allee","zone":"unterort","shared":true,"part":"Pizzeria Fontana bis Ortszentrum"},"geometry":{"type":"LineString","coordinates":[[16.335876,48.111632],[16.338091,48.10778],[16.338431,48.107375],[16.338952,48.106957]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.327903,48.139601],[16.327221,48.138705],[16.326822,48.138229],[16.326374,48.137652],[16.325387,48.136343],[16.323187,48.132951],[16.322758,48.1322],[16.319184,48.125524]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.318523,48.123627],[16.318447,48.123152]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.315504,48.109831],[16.315464,48.109352]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.322124,48.131013],[16.321934,48.130554]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.321169,48.129004],[16.321006,48.128603],[16.320306,48.127288],[16.320007,48.126837]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.322457,48.13153],[16.32217,48.131098]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.321583,48.129787],[16.321351,48.129348]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.31877,48.124327],[16.318589,48.12387]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.315463,48.109259],[16.315534,48.108774]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.321557,48.129852],[16.321351,48.129348],[16.321184,48.129029],[16.319897,48.126626],[16.319622,48.126211]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.327954,48.139594],[16.327273,48.138697],[16.326481,48.137715],[16.325434,48.13633],[16.323232,48.13293],[16.32262,48.131835],[16.319622,48.126211]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.320306,48.127288],[16.319618,48.12597]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.319897,48.126626],[16.319471,48.125805]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.319622,48.126211],[16.319023,48.125092],[16.318883,48.124716],[16.318666,48.123959]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.319184,48.125524],[16.318932,48.125012],[16.318779,48.124549]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.318779,48.124549],[16.317523,48.119991],[16.316823,48.116887],[16.316495,48.115561],[16.315586,48.112194],[16.315486,48.111667],[16.315443,48.111227],[16.315436,48.110802],[16.315505,48.107535],[16.315174,48.103261],[16.314946,48.099907],[16.314697,48.096862],[16.314126,48.089124]]}},{"type":"Feature","properties":{"kind":"rail","street":"Badner Bahn","zone":null},"geometry":{"type":"LineString","coordinates":[[16.318666,48.123959],[16.317485,48.119626],[16.316874,48.11688],[16.315863,48.112959],[16.315717,48.112218],[16.315632,48.111663],[16.315519,48.11061],[16.315498,48.110141],[16.315557,48.107528],[16.314892,48.098641],[16.314818,48.096932]]}},{"type":"Feature","properties":{"kind":"settlement","street":"Seeparksiedlung","zone":"seepark"},"geometry":{"type":"Polygon","coordinates":[[[16.34861,48.113908],[16.347651,48.11196],[16.347602,48.111819],[16.34749,48.11177],[16.347609,48.111411],[16.34782,48.111008],[16.348108,48.110522],[16.348298,48.110132],[16.34851,48.109598],[16.348792,48.108691],[16.349542,48.107177],[16.349747,48.106851],[16.349964,48.106659],[16.351354,48.109187],[16.351418,48.10916],[16.351463,48.109116],[16.351471,48.108992],[16.351239,48.108682],[16.350692,48.107701],[16.351448,48.107509],[16.351554,48.10757],[16.352282,48.10905],[16.352015,48.109171],[16.351896,48.109332],[16.351935,48.109599],[16.351981,48.109635],[16.352052,48.109809],[16.352094,48.109997],[16.352598,48.110803],[16.352714,48.110836],[16.352754,48.110981],[16.352695,48.11102],[16.352818,48.111332],[16.351973,48.111523],[16.351955,48.111475],[16.351837,48.111499],[16.3517,48.111472],[16.351314,48.111506],[16.350932,48.11149],[16.350609,48.111427],[16.350337,48.111345],[16.35024,48.11143],[16.350629,48.111772],[16.34865,48.112244],[16.348575,48.112428],[16.348618,48.11262],[16.349159,48.113716],[16.349167,48.113791]]]}},{"type":"Feature","properties":{"kind":"settlement","street":"Tröber Siedlung","zone":"unterort"},"geometry":{"type":"Polygon","coordinates":[[[16.327087,48.118303],[16.327691,48.118427],[16.327751,48.118619],[16.328309,48.118691],[16.328368,48.118582],[16.329502,48.11874],[16.329491,48.118823],[16.330246,48.118849],[16.330222,48.118671],[16.329935,48.118604],[16.329049,48.11671],[16.328902,48.116504],[16.32861,48.115972],[16.327906,48.116126],[16.327943,48.116196],[16.326499,48.116564],[16.327037,48.117769],[16.326878,48.117825]]]}},{"type":"Feature","properties":{"kind":"settlement","street":"Benyasiedlung","zone":"oberort","shared":true,"note":"Gemeinde-Website: Anton-Benya-Straße gehört zu Oberort. Der Kalender 2026 nennt die Benyasiedlung auf der Seepark-Seite (dort wegen der Müllinseln)."},"geometry":{"type":"Polygon","coordinates":[[[16.312154,48.115627],[16.311272,48.115191],[16.31127,48.115018],[16.311315,48.114923],[16.311361,48.114934],[16.31156,48.114759],[16.312673,48.114474],[16.312729,48.11448],[16.312955,48.115395],[16.313015,48.11553],[16.314448,48.115553],[16.314567,48.115608],[16.314828,48.116745],[16.31431,48.116829]]]}}]};

const CARD_TYPE = "voesendorf-waste-card";
const STORAGE_KEY = "voesendorf-waste-card";

const ZONE_COLOURS = {
  oberort: "#e08a1e",
  unterort: "#3d7ebd",
  seepark: "#3f9e8f",
};
const TYPE_COLOURS = { RM: "#ef9d0c", RM4: "#8b5cf6", Bio: "#6ea83c" };
const TYPE_ORDER = ["RM", "RM4", "Bio"];

const LEAFLET = {
  css: [
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css",
  ],
  js: [
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js",
  ],
};

// Raster tiles served by the Home Assistant instance itself (map_tiles proxy).
// The proxy refuses requests without the rotating access token, and Leaflet
// substitutes the `token` layer option into the template.
const HA_TILES_PATH = "/api/map_tiles/raster/{z}/{x}/{y}.png?token={token}";

// Inline icons keep the card free of any Home Assistant component dependency.
const svgIcon = (path) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">` +
  `<path fill="currentColor" d="${path}"/></svg>`;
const ICONS = {
  details: svgIcon("M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6Z"),
  close: svgIcon("M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"),
  prev: svgIcon("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z"),
  next: svgIcon("M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59Z"),
  today: svgIcon("M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"),
};

const STRINGS = {
  de: {
    next: "Nächste Abholungen",
    today: "heute",
    tomorrow: "morgen",
    inDays: "in {n} Tagen",
    nothing: "In den nächsten {n} Tagen ist keine Abholung geplant.",
    year: "Jahresübersicht {year}",
    area: "Abfuhrgebiet",
    street: "Straße",
    chooseStreet: "Straße wählen …",
    allAreas: "Alle Bereiche",
    map: "Karte",
    mapHint: "Klick auf eine Straße zeigt das Abfuhrgebiet.",
    mapUnavailable: "Karte nicht verfügbar (Leaflet konnte nicht geladen werden).",
    mapLoading: "Karte wird geladen …",
    mapAttribution: "Eigene Darstellung auf Basis von OpenStreetMap-Daten (ODbL)",
    mapAttributionTiles: "Kacheln: {provider}",
    mapAttributionHa: "Kacheln über den Home-Assistant-Kartenproxy (OpenStreetMap)",
    mapOffline: "ohne Kartenkacheln",
    details: "Details & Zusatztermine",
    monthPrev: "Voriger Monat",
    monthNext: "Nächster Monat",
    monthCurrent: "Aktueller Monat",
    close: "Schließen",
    mapTilesBlocked:
      "Der Kachelserver hat die Anfragen blockiert (tile.openstreetmap.org ist nicht für eingebettete Karten gedacht). Es wird die Offline-Karte ohne Kacheln angezeigt.",
    openInOsm: "In OpenStreetMap öffnen",
    legend: "Legende",
    holiday: "Feiertag",
    shifted: "verschobener Termin (Feiertag)",
    interval: "Intervall",
    containers: "Container im Gebiet",
    notes: "Hinweise",
    source: "Quelle",
    warningShared: "Diese Straße wird von zwei Abfuhrgebieten geteilt – bitte Termin mit der Gemeinde prüfen.",
    warningBeny: "Die Benyasiedlung wird im Kalender 2026 auf der Seepark-Seite geführt, die Gemeinde-Website nennt die Anton-Benya-Straße unter Oberort.",
    settings: "Einstellungen",
    hideSettings: "Einstellungen ausblenden",
    showExtras: "Zusatztermine (ASZ, Sperrmüll, Blumenerde)",
    asz: "Altstoffsammelzentrum",
    sperrmuell: "Sperrmüll",
    blumenerde: "Blumenerde-Aktion",
    byPhone: "nach telefonischer Vereinbarung: 01/699 03-35",
    closed: "Geschlossen",
    error: "Kalenderdaten konnten nicht gelesen werden.",
  },
  en: {
    next: "Next collections",
    today: "today",
    tomorrow: "tomorrow",
    inDays: "in {n} days",
    nothing: "No collection scheduled within the next {n} days.",
    year: "Year overview {year}",
    area: "Collection area",
    street: "Street",
    chooseStreet: "Choose your street …",
    allAreas: "All areas",
    map: "Map",
    mapHint: "Click a street to highlight its collection area.",
    mapUnavailable: "Map unavailable (Leaflet could not be loaded).",
    mapLoading: "Loading map …",
    mapAttribution: "Own rendering based on OpenStreetMap data (ODbL)",
    mapAttributionTiles: "Tiles: {provider}",
    mapAttributionHa: "Tiles via the Home Assistant map tile proxy (OpenStreetMap)",
    mapOffline: "no map tiles",
    details: "Details & extra dates",
    monthPrev: "Previous month",
    monthNext: "Next month",
    monthCurrent: "Current month",
    close: "Close",
    mapTilesBlocked:
      "The tile server blocked the requests (tile.openstreetmap.org is not meant for embedded maps). Showing the tile-less offline map instead.",
    openInOsm: "Open in OpenStreetMap",
    legend: "Legend",
    holiday: "Public holiday",
    shifted: "shifted date (public holiday)",
    interval: "Interval",
    containers: "Containers in the area",
    notes: "Notes",
    source: "Source",
    warningShared: "This street is shared by two collection areas – please double-check with the municipality.",
    warningBeny: "In the 2026 calendar the Benyasiedlung is listed on the Seepark page, while the municipality website lists Anton-Benya-Straße under Oberort.",
    settings: "Settings",
    hideSettings: "Hide settings",
    showExtras: "Additional dates (recycling centre, bulky waste, compost)",
    asz: "Recycling centre (ASZ)",
    sperrmuell: "Bulky waste",
    blumenerde: "Compost give-away",
    byPhone: "by phone: +43 1 699 03-35",
    closed: "Closed",
    error: "Could not read the calendar data.",
  },
};

const MONTHS = {
  de: ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
       "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August",
       "September", "October", "November", "December"],
};
const WEEKDAYS = {
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

/* ------------------------------------------------------------------ utils */

const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

function normalise(name) {
  return name
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/\b(dr|doktor)\b/g, " ")
    .replace(/[^a-z0-9]/g, "");
}

function loadOnce(urls, tag, attributes = {}) {
  return new Promise((resolve, reject) => {
    let index = 0;
    const attempt = () => {
      if (index >= urls.length) {
        reject(new Error(`could not load ${tag}`));
        return;
      }
      const url = urls[index++];
      const element = document.createElement(tag);
      if (tag === "link") {
        element.rel = "stylesheet";
        element.href = url;
      } else {
        element.src = url;
        element.async = true;
      }
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      element.onload = () => resolve(url);
      element.onerror = attempt;
      document.head.appendChild(element);
    };
    attempt();
  });
}

let leafletPromise = null;
function ensureLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = loadOnce(LEAFLET.js, "script")
      .then(() => window.L || Promise.reject(new Error("Leaflet missing")));
  }
  return leafletPromise;
}

/**
 * Leaflet's stylesheet has to live INSIDE the shadow root - document level CSS does
 * not reach shadow DOM, and without it the map panes are positioned wrongly.
 * The first CDN that answers wins; if all fail a small built-in subset is used.
 */
const MINIMAL_LEAFLET_CSS = `
.leaflet-container{overflow:hidden;-webkit-tap-highlight-color:transparent;}
.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,
.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{
  position:absolute;left:0;top:0;}
.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important;}
.leaflet-container img.leaflet-tile{max-width:none!important;max-height:none!important;
  width:auto;padding:0;}
.leaflet-tile{filter:inherit;visibility:hidden;}
.leaflet-tile-loaded{visibility:inherit;}
.leaflet-pane{z-index:400;}
.leaflet-tile-pane{z-index:200;}.leaflet-overlay-pane{z-index:400;}
.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto;}
.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none;}
.leaflet-top{top:0;}.leaflet-right{right:0;}.leaflet-bottom{bottom:0;}.leaflet-left{left:0;}
.leaflet-control{margin:6px;}
.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,.65);border-radius:4px;}
.leaflet-bar a{display:block;width:26px;height:26px;line-height:26px;text-align:center;
  text-decoration:none;background:#fff;color:#000;border-bottom:1px solid #ccc;}
.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px monospace;text-indent:1px;}
.leaflet-control-attribution{background:rgba(255,255,255,.8);padding:0 4px;margin:0;
  color:#333;font-size:11px;}
.leaflet-control-attribution a{color:#0078a8;}
.leaflet-container a{color:#0078a8;}
.leaflet-tooltip{position:absolute;padding:6px;background:#fff;border:1px solid #fff;
  border-radius:3px;color:#222;white-space:nowrap;pointer-events:none;
  box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:12px;}
.leaflet-tooltip:before{content:"";position:absolute;border:6px solid transparent;}
.leaflet-interactive{cursor:pointer;}
`;

let leafletCssPromise = null;
function ensureLeafletCss() {
  if (!leafletCssPromise) {
    leafletCssPromise = (async () => {
      for (const url of LEAFLET.css) {
        try {
          const response = await fetch(url, { mode: "cors", credentials: "omit" });
          if (response.ok) return await response.text();
        } catch (error) {
          /* try the next mirror */
        }
      }
      return MINIMAL_LEAFLET_CSS;
    })();
  }
  return leafletCssPromise;
}

/* ------------------------------------------------------- schedule helpers */

/** All collection dates of a zone as { 'YYYY-MM-DD': ['RM','RM4','Bio'] }. */
function dateMap(zone) {
  const map = {};
  for (const type of TYPE_ORDER) {
    for (const day of (zone.dates && zone.dates[type]) || []) {
      (map[day] = map[day] || []).push(type);
    }
  }
  return map;
}

function streetIndex(schedule) {
  const index = new Map();
  for (const [slug, zone] of Object.entries(schedule.zones)) {
    const names = [...zone.streets];
    for (const street of Object.keys(zone.split_streets || {})) names.push(street);
    for (const name of names) {
      const key = normalise(name);
      if (!index.has(key)) index.set(key, []);
      if (!index.get(key).includes(slug)) index.get(key).push(slug);
    }
  }
  return index;
}

/* ------------------------------------------------------------------- card */

class VoesendorfWasteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._zone = null;
    this._street = null;
    this._map = null;
    this._layers = {};
    this._tileMode = null;
    this._darkTiles = false;
    this._haToken = "";
    this._monthOffset = 0;      // 0 = current month, the card only shows one
    this._detailsOpen = false;  // the details dialog survives a re-render
    this._renderedHash = null;
    this._showSettings = false;
    this._streetsIndex = streetIndex(SCHEDULE);
  }

  static getStubConfig() {
    return { type: `custom:${CARD_TYPE}` };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    const zone = (config.zone || "auto").toLowerCase();
    if (zone !== "auto" && !SCHEDULE.zones[zone]) {
      throw new Error(`Unknown zone "${config.zone}" – valid: auto, ${Object.keys(SCHEDULE.zones).join(", ")}`);
    }
    this._config = {
      title: "Abfallkalender Vösendorf",
      show_map: true,
      show_types: TYPE_ORDER,
      days_ahead: 6,
      show_extras: true,
      map_height: 320,
      tile_url: "",            // empty = offline map, no requests to any tile server
      tile_attribution: "",
      tile_fallback: true,     // switch to the offline map if tiles are blocked
      tile_source: "",         // "" = offline | "ha" = tiles proxied by Home Assistant | "custom"
      ...config,
      zone,
    };
    if (config.street) this._setStreet(config.street, false);
    else this._zone = zone === "auto" ? this._zone : zone;
    if (!this._zone && zone !== "auto") this._zone = zone;
    this._renderedHash = null;
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    const today = iso(new Date());
    if (first || this._today !== today) {
      this._today = today;
      this._monthOffset = 0;   // a new day: back to the current month
      this._render();
    }
    const dark = Boolean(hass && hass.themes && hass.themes.darkMode);
    if (this._tileMode && dark !== this._darkTiles) {
      const container = this.shadowRoot.getElementById("map");
      if (container) this._syncTileTheme(container);
    }
  }

  getCardSize() {
    return this._config && this._config.show_map ? 12 : 8;
  }

  get _zoneCount() {
    return Object.keys(SCHEDULE.zones).length;
  }

  /* ------------------------------------------------------------- helpers */

  get _lang() {
    const language = this._hass?.locale?.language || this._hass?.language || "de";
    return language.toLowerCase().startsWith("de") ? "de" : "en";
  }

  _t(key, replacements) {
    let text = STRINGS[this._lang][key] ?? STRINGS.de[key] ?? key;
    if (replacements) {
      for (const [name, value] of Object.entries(replacements)) {
        text = text.replace(`{${name}}`, value);
      }
    }
    return text;
  }

  _zoneEntry(slug) {
    const zone = SCHEDULE.zones[slug];
    return zone ? { slug, ...zone } : null;
  }

  _restoreState() {
    let saved = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      saved = null;
    }
    if (saved?.street) this._setStreet(saved.street, false);
    else if (saved?.zone && SCHEDULE.zones[saved.zone]) this._zone = saved.zone;
  }

  _saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ zone: this._zone, street: this._street }));
    } catch (error) {
      /* private mode – ignore */
    }
  }

  _setStreet(street, render = true) {
    this._street = street;
    const zones = this._streetsIndex.get(normalise(street)) || [];
    this._zone = zones[0] || this._zone;
    if (render) {
      this._saveState();
      this._renderedHash = null;
      this._render();
    }
  }

  _setZone(slug, render = true) {
    this._zone = slug;
    if (render) {
      this._saveState();
      this._renderedHash = null;
      this._render();
    }
  }

  /** Streets that a zone contains, including the two shared ones. */
  _streetsOf(slug) {
    const zone = SCHEDULE.zones[slug];
    const shared = Object.keys(zone.split_streets || {});
    return [...zone.streets, ...shared];
  }

  _nextCollections(slug, days) {
    const zone = SCHEDULE.zones[slug];
    const map = dateMap(zone);
    const today = startOfDay(new Date());
    const limit = new Date(today.getTime() + days * 86400000);
    const entries = [];
    for (const [day, types] of Object.entries(map)) {
      const date = new Date(`${day}T00:00:00`);
      if (date >= today && date <= limit) {
        entries.push({ day, date, types: types.filter((t) => this._config.show_types.includes(t)) });
      }
    }
    return entries.sort((a, b) => a.day.localeCompare(b.day)).filter((e) => e.types.length);
  }

  _formatDay(date) {
    const language = this._lang === "de" ? "de-AT" : "en-GB";
    return new Intl.DateTimeFormat(language, { weekday: "long", day: "2-digit", month: "long" })
      .format(date);
  }

  _relative(date) {
    const diff = daysBetween(new Date(), date);
    if (diff === 0) return this._t("today");
    if (diff === 1) return this._t("tomorrow");
    return this._t("inDays", { n: diff });
  }

  /* -------------------------------------------------------------- render */

  _hash() {
    return JSON.stringify([this._zone, this._street, this._lang, this._today,
                           this._config.show_map, this._config.show_extras,
                           this._config.tile_url, this._config.tile_source,
                           this._config.map_height, this._monthOffset,
                           this._showSettings, this._config.show_types]);
  }

  _render() {
    if (!this._config || !this.isConnected) return;
    const hash = this._hash();
    if (hash === this._renderedHash && this.shadowRoot.querySelector(".card")) return;
    this._renderedHash = hash;
    this._restoreStateOnce();

    if (!this._zone) {
      this.shadowRoot.innerHTML = this._shell(this._bodyAllZones());
      this._attachHandlers();
      return;
    }
    const zone = this._zoneEntry(this._zone);
    this.shadowRoot.innerHTML = this._shell(this._bodyZone(zone));
    this._attachHandlers();
    if (this._config.show_map) this._renderMap(zone);
    if (this._detailsOpen) {
      const dialog = this.shadowRoot.getElementById("details");
      if (dialog) dialog.showModal();
    }
  }

  _restoreStateOnce() {
    if (this._restored) return;
    this._restored = true;
    if (!this._zone && !this._street) this._restoreState();
    if (!this._zone) {
      // nothing chosen yet: keep "all areas" overview but remember the state
      this._saveState();
    }
  }

  _shell(body) {
    return `
      <style>
        :host { display: block; }
        ha-card { overflow: hidden; }
        .card { padding: 16px; }
        h2 { margin: 0 0 4px; font-size: 1.15rem; font-weight: 500; color: var(--primary-text-color); }
        h3 { margin: 18px 0 8px; font-size: 1rem; font-weight: 500; color: var(--primary-text-color); }
        .muted { color: var(--secondary-text-color); font-size: .85rem; line-height: 1.4; }
        .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .grow { flex: 1 1 220px; min-width: 200px; }
        select, button {
          font: inherit; color: var(--primary-text-color); background: var(--card-background-color, transparent);
          border: 1px solid var(--divider-color); border-radius: 6px; padding: 8px 10px;
        }
        button { cursor: pointer; }
        button.ghost { border-color: transparent; color: var(--primary-color); padding: 6px 8px; }
        .pills { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .pill { display: inline-flex; align-items: center; gap: 6px; font-size: .85rem;
                padding: 3px 10px; border-radius: 999px; color: #fff; white-space: nowrap; }
        .type-RM { background: ${TYPE_COLOURS.RM}; }
        .type-RM4 { background: ${TYPE_COLOURS.RM4}; }
        .type-Bio { background: ${TYPE_COLOURS.Bio}; }
        .next { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
        .next-row { display: flex; gap: 12px; align-items: baseline; padding: 8px 10px;
                    border-radius: 8px; background: var(--secondary-background-color, rgba(127,127,127,.08)); }
        .next-date { min-width: 168px; font-weight: 500; }
        .next-rel { color: var(--secondary-text-color); font-size: .85rem; }
        /* one month only: the full year made the card far too tall */
        .months { max-width: min(320px, 100%); }
        .month { border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; }
        .month-name { font-size: .85rem; font-weight: 500; margin-bottom: 4px; }
        .month-head { display: flex; align-items: center; justify-content: space-between;
                      gap: 12px; margin: 18px 0 8px; }
        .month-head h3 { margin: 0; }
        .month-nav { display: flex; gap: 4px; }
        .icon-btn { display: inline-flex; align-items: center; justify-content: center;
                    width: 34px; height: 34px; padding: 0; border-radius: 50%;
                    border: 1px solid var(--divider-color); background: transparent;
                    color: var(--primary-text-color); cursor: pointer; }
        .icon-btn:hover:not([disabled]) { background: var(--secondary-background-color, rgba(127,127,127,.12)); }
        .icon-btn[disabled] { opacity: .3; cursor: default; }
        dialog#details { border: none; border-radius: 14px; padding: 0; margin: auto;
                         width: min(560px, 92vw); max-height: 85vh;
                         background: var(--card-background-color, #fff);
                         color: var(--primary-text-color);
                         box-shadow: 0 12px 44px rgba(0, 0, 0, .4); }
        dialog#details::backdrop { background: rgba(0, 0, 0, .45); }
        .dialog-head { display: flex; align-items: center; justify-content: space-between;
                       gap: 12px; padding: 12px 8px 12px 16px;
                       border-bottom: 1px solid var(--divider-color); }
        .dialog-head h3 { margin: 0; }
        .dialog-body { padding: 4px 16px 16px; overflow: auto; max-height: 66vh; }
        .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .dow { font-size: .62rem; text-align: center; color: var(--secondary-text-color); }
        .day { position: relative; font-size: .68rem; text-align: center; line-height: 1.35;
               border-radius: 4px; color: var(--primary-text-color); }
        .day.out { visibility: hidden; }
        .day.marked { color: #fff; font-weight: 500; }
        .day.holiday { box-shadow: inset 0 0 0 1px #d9534f; }
        .day.today { outline: 2px solid var(--primary-color); outline-offset: -1px; }
        .dots { display: flex; gap: 2px; justify-content: center; margin-top: 1px; height: 5px; }
        .dot { width: 5px; height: 5px; border-radius: 50%; }
        .legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; font-size: .8rem;
                  color: var(--secondary-text-color); }
        .legend span { display: inline-flex; align-items: center; gap: 5px; }
        .swatch { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
        #map { height: ${this._config?.map_height ?? 320}px; border-radius: 8px; margin-top: 8px;
               overflow: hidden; background: var(--secondary-background-color, rgba(127,127,127,.1)); }
        #map svg { display: block; width: 100%; height: 100%; }
        /* the offline map has no fixed aspect, so it may use more vertical space */
        #map.offline { height: auto; }
        #map.offline svg { height: auto; max-height: var(--map-max-height, 640px); }
        /* the raster tiles are inverted in dark mode, exactly like the built-in map */
        #map.dark-tiles .leaflet-tile {
          filter: invert(.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(.3);
        }
        .zone-label { font-size: 26px; font-weight: 600; text-anchor: middle;
                      fill: var(--primary-text-color); fill-opacity: .55; }
        .map-foot { display: block; margin-top: 6px; font-size: .72rem;
                    color: var(--secondary-text-color); }
        .map-foot a { color: var(--secondary-text-color); }
        .zone-legend { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 4px;
                       font-size: .78rem; color: var(--primary-text-color); }
        .zone-key { display: inline-flex; align-items: center; gap: 5px; }
        .zone-key.active { font-weight: 600; }
        .map-attr { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; }
        .notice { margin-top: 8px; padding: 8px 10px; border-radius: 8px; font-size: .85rem;
                  background: rgba(217,83,79,.12); color: var(--primary-text-color); }
        .info-list { margin: 6px 0 0; padding-left: 18px; }
        .info-list li { margin-bottom: 2px; }
        footer { margin-top: 16px; display: flex; justify-content: space-between; gap: 12px;
                 flex-wrap: wrap; font-size: .75rem; color: var(--secondary-text-color); }
        footer a { color: var(--secondary-text-color); }
        .badge { font-size: .7rem; padding: 2px 8px; border-radius: 999px;
                 border: 1px solid var(--divider-color); color: var(--secondary-text-color); }
      </style>
      <ha-card>${body}</ha-card>`;
  }

  _header(zone, actions = "") {
    const title = this._config.title || "Abfallkalender Vösendorf";
    const subtitle = zone
      ? `${this._t("area")}: <strong>${zone.name}</strong>${this._street ? ` – ${this._street}` : ""}`
      : `${SCHEDULE.municipality.split(",")[0]} · ${SCHEDULE.year}`;
    const intervals = zone
      ? TYPE_ORDER.filter((type) => this._config.show_types.includes(type))
          .map((type) => `${SCHEDULE.legend[type].short}: ${this._weekdayName(zone.weekday[type])}`)
          .join(" · ")
      : "";
    return `
      <div class="row">
        <div class="grow">
          <h2>${title} ${zone ? "" : `<span class="badge">${SCHEDULE.year}</span>`}</h2>
          <div class="muted">${subtitle}</div>
        </div>
        ${intervals ? `<div class="badge">${intervals}</div>` : ""}
        ${actions}
      </div>
      ${this._streetPicker(zone)}`;
  }

  _streetPicker(zone) {
    const groups = Object.entries(SCHEDULE.zones).map(([slug, info]) => {
      const names = [...this._streetsOf(slug)].sort((a, b) => a.localeCompare(b, "de"));
      const options = names
        .map((name) => {
          const value = `${name}@@${slug}`;
          const selected = this._street === name && (!this._zone || this._zone === slug);
          return `<option value="${value}"${selected ? " selected" : ""}>${name}${
            (info.split_streets || {})[name] ? " (geteilt)" : ""}</option>`;
        })
        .join("");
      return `<optgroup label="${info.name}">${options}</optgroup>`;
    }).join("");
    return `
      <div class="row" style="margin-top:12px">
        <label class="grow">
          <span class="muted">${this._t("street")}</span>
          <select id="street" style="width:100%">
            <option value="">${this._t("chooseStreet")}</option>
            ${groups}
          </select>
        </label>
        <label>
          <span class="muted">${this._t("area")}</span>
          <select id="zone" style="width:100%">
            <option value="">${this._t("allAreas")}</option>
            ${Object.entries(SCHEDULE.zones).map(([slug, info]) =>
              `<option value="${slug}"${this._zone === slug ? " selected" : ""}>${info.name}</option>`).join("")}
          </select>
        </label>
      </div>`;
  }

  _bodyAllZones() {
    const cards = Object.entries(SCHEDULE.zones).map(([slug, zone]) => {
      const next = this._nextCollections(slug, this._config.days_ahead).slice(0, 2);
      return `
        <div class="next-row" data-zone="${slug}" style="cursor:pointer">
          <span class="swatch" style="background:${ZONE_COLOURS[slug]}"></span>
          <div class="grow">
            <div><strong>${zone.name}</strong> <span class="muted">${zone.description}</span></div>
            <div class="muted">${next.map((entry) =>
              `${this._formatDay(entry.date)}: ${entry.types.map((t) => SCHEDULE.legend[t].name).join(", ")}`
            ).join(" · ") || "–"}</div>
          </div>
        </div>`;
    }).join("");
    return `<div class="card">
      ${this._header(null)}
      <h3>${this._t("area")}</h3>
      <div class="next">${cards}</div>
      <div class="muted" style="margin-top:10px">${this._t("street")} → ${this._t("area")}</div>
    </div>`;
  }

  _bodyZone(zone) {
    const zone_colour = ZONE_COLOURS[zone.slug];
    const next = this._nextCollections(zone.slug, this._config.days_ahead);
    const dateMapZone = dateMap(zone);
    const shared = Object.keys(zone.split_streets || {});
    const ambiguous = this._street && shared.includes(this._street.replace(/\s*\(.*\)$/, ""));
    const benya = /benya/i.test(this._street || "");

    const nextHtml = next.length
      ? next.map((entry) => `
          <div class="next-row">
            <span class="next-date" style="color:${zone_colour}">${this._formatDay(entry.date)}</span>
            <span class="next-rel">${this._relative(entry.date)}</span>
            <span class="pills">${entry.types.map((type) =>
              `<span class="pill type-${type}">${SCHEDULE.legend[type].name}</span>`).join("")}</span>
          </div>`).join("")
      : `<div class="muted">${this._t("nothing", { n: this._config.days_ahead })}</div>`;

    const intervals = TYPE_ORDER
      .filter((type) => this._config.show_types.includes(type))
      .map((type) => `<span><span class="swatch" style="background:${TYPE_COLOURS[type]}"></span>
        ${SCHEDULE.legend[type].name} – ${SCHEDULE.legend[type].interval}
        (${this._weekdayName(zone.weekday[type])})</span>`).join("");

    const containers = (zone.containers || []).map((group) =>
      `<li><strong>${group.container}:</strong> ${group.places.join(", ")}</li>`).join("");
    const hasDetails = Boolean(containers) || (zone.notes || []).length > 0 ||
      Boolean(this._config.show_extras);
    const detailsButton = hasDetails
      ? `<button class="icon-btn" id="details-open" title="${this._t("details")}"` +
        ` aria-label="${this._t("details")}">${ICONS.details}</button>`
      : "";

    return `<div class="card">
      ${this._header({ ...zone, weekday: zone.weekday }, detailsButton)}
      ${ambiguous ? `<div class="notice">${this._t("warningShared")}</div>` : ""}
      ${benya ? `<div class="notice">${this._t("warningBeny")}</div>` : ""}
      <h3>${this._t("next")}</h3>
      <div class="next">${nextHtml}</div>
      <div class="legend">${intervals}</div>
      <div class="legend"><span><span class="swatch" style="background:#d9534f"></span>${this._t("holiday")}</span>
        <span><span class="swatch" style="box-shadow:inset 0 0 0 2px var(--primary-color)"></span>${this._t("today")}</span></div>
      ${this._config.show_map ? `
        <h3>${this._t("map")} <span class="muted" style="font-weight:400">– ${this._t("mapHint")}</span></h3>
        <div id="map-wrap"><div id="map"></div><div class="map-foot" id="map-foot"></div></div>` : ""}
      ${this._monthSection(dateMapZone)}
      <footer>
        <span><a href="${SCHEDULE.sources.info_page}" target="_blank" rel="noopener">
          ${this._t("source")}: Marktgemeinde Vösendorf</a> · ${SCHEDULE.year}</span>
        <span>Karte: © OpenStreetMap contributors</span>
      </footer>
      ${hasDetails ? this._detailsDialog(zone, containers) : ""}
    </div>`;
  }

  /**
   * One month at a time. The full year fitted badly on a dashboard, so the
   * calendar is limited to a single month (navigable inside the schedule year).
   */
  _monthSection(dateMapZone) {
    const base = new Date();
    const date = new Date(base.getFullYear(), base.getMonth() + this._monthOffset, 1);
    const first = new Date(SCHEDULE.year, 0, 1);
    const last = new Date(SCHEDULE.year, 11, 1);
    const nav = (id, label, icon, disabled) =>
      `<button class="icon-btn" id="${id}"${disabled ? " disabled" : ""}` +
      ` title="${label}" aria-label="${label}">${icon}</button>`;
    return `
      <div class="month-head">
        <h3>${MONTHS[this._lang][date.getMonth()]} ${date.getFullYear()}</h3>
        <div class="month-nav">
          ${nav("month-prev", this._t("monthPrev"), ICONS.prev, date <= first)}
          ${nav("month-current", this._t("monthCurrent"), ICONS.today, !this._monthOffset)}
          ${nav("month-next", this._t("monthNext"), ICONS.next, date >= last)}
        </div>
      </div>
      <div class="months">${this._monthHtml(dateMapZone, date)}</div>`;
  }

  /** Containers, notes and extra dates, tucked into a dialog to save space. */
  _detailsDialog(zone, containers) {
    const notes = (zone.notes || []).map((note) => `<li>${note}</li>`).join("");
    return `
      <dialog id="details" aria-label="${this._t("details")}">
        <div class="dialog-head">
          <h3>${this._t("details")}</h3>
          <button class="icon-btn" id="details-close" title="${this._t("close")}"
                  aria-label="${this._t("close")}">${ICONS.close}</button>
        </div>
        <div class="dialog-body">
          ${containers ? `<h3>${this._t("containers")}</h3><ul class="info-list muted">${containers}</ul>` : ""}
          ${notes ? `<h3>${this._t("notes")}</h3><ul class="info-list muted">${notes}</ul>` : ""}
          ${this._config.show_extras ? this._extrasHtml() : ""}
        </div>
      </dialog>`;
  }

  _weekdayName(short) {
    const index = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(short);
    return index >= 0 ? WEEKDAYS[this._lang][index] : short;
  }

  /** Grid of exactly one month (the heading lives in `_monthSection`). */
  _monthHtml(dateMapZone, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const holidays = new Set(SCHEDULE.holidays.map((h) => h.date));
    const today = iso(new Date());
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first
    let cells = WEEKDAYS[this._lang].map((dow) => `<div class="dow">${dow[0]}</div>`).join("");
    for (let i = 0; i < offset; i += 1) cells += `<div class="day out"></div>`;
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = iso(new Date(year, month, day));
      const types = (dateMapZone[key] || []).filter((t) => this._config.show_types.includes(t));
      const title = [
        this._formatDay(new Date(year, month, day)),
        types.map((t) => SCHEDULE.legend[t].name).join(", "),
        holidays.has(key) ? this._t("holiday") : "",
      ].filter(Boolean).join(" – ");
      const classes = ["day"];
      if (types.length) classes.push("marked");
      if (holidays.has(key)) classes.push("holiday");
      if (key === today) classes.push("today");
      const background = types.length
        ? `background:linear-gradient(135deg, ${types.map((t, i) =>
            `${TYPE_COLOURS[t]} ${(i / types.length) * 100}% ${((i + 1) / types.length) * 100}%`).join(", ")})`
        : "";
      cells += `<div class="${classes.join(" ")}" style="${background}" title="${title}">${day}</div>`;
    }
    return `<div class="month"><div class="days">${cells}</div></div>`;
  }

  _extrasHtml() {
    const extras = SCHEDULE.extras;
    const format = (isoDate) => this._shortDate(new Date(`${isoDate}T00:00:00`));
    const compost = extras.blumenerde.events.map((event) =>
      `${format(event.date)} ${event.time} (${event.place})`).join("<br>");
    const hours = Object.entries(extras.asz.hours)
      .map(([day, time]) => `${day}: ${time}`).join("<br>");
    const closed = extras.asz.closed
      .map((entry) => typeof entry === "string" ? entry
        : `${format(entry.date)}${entry.label ? ` (${entry.label})` : ""}`)
      .join(", ") + (extras.asz.closed_note ? `, ${extras.asz.closed_note}` : "");
    return `
      <h3>${this._t("showExtras")}</h3>
      <ul class="info-list muted">
        <li><strong>${this._t("asz")}:</strong><br>${hours}<br>
            ${this._t("closed")}: ${closed}</li>
        <li><strong>${this._t("sperrmuell")}:</strong> ${this._t("byPhone")}<br>
            ${extras.sperrmuell.note}</li>
        <li><strong>${this._t("blumenerde")}:</strong><br>${compost}</li>
      </ul>`;
  }

  _shortDate(date) {
    return new Intl.DateTimeFormat(this._lang === "de" ? "de-AT" : "en-GB",
      { day: "2-digit", month: "long" }).format(date);
  }

  /* --------------------------------------------------------------- events */

  _attachHandlers() {
    const street = this.shadowRoot.getElementById("street");
    if (street) {
      street.addEventListener("change", (event) => {
        const value = event.target.value;
        if (!value) {
          this._setZone("", true);
          return;
        }
        const [name, slug] = value.split("@@");
        this._street = name;
        this._zone = slug || this._zone;
        this._saveState();
        this._renderedHash = null;
        this._render();
      });
    }
    const zone = this.shadowRoot.getElementById("zone");
    if (zone) {
      zone.addEventListener("change", (event) => this._setZone(event.target.value, true));
    }
    this.shadowRoot.querySelectorAll("[data-zone]").forEach((element) => {
      element.addEventListener("click", () => this._setZone(element.dataset.zone, true));
    });

    // Details (containers, notes, extra dates) live in a dialog to keep the card small.
    const dialog = this.shadowRoot.getElementById("details");
    const openButton = this.shadowRoot.getElementById("details-open");
    if (dialog && openButton) {
      this._detailsOpen = dialog.open;
      openButton.addEventListener("click", () => {
        this._detailsOpen = true;
        dialog.showModal();
      });
      this.shadowRoot.getElementById("details-close")?.addEventListener("click", () => dialog.close());
      // A click on the backdrop targets the dialog element itself.
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", () => { this._detailsOpen = dialog.open; });
    }

    const shiftMonth = (step) => {
      this._monthOffset += step;
      this._renderedHash = null;
      this._render();
    };
    this.shadowRoot.getElementById("month-prev")?.addEventListener("click", () => shiftMonth(-1));
    this.shadowRoot.getElementById("month-next")?.addEventListener("click", () => shiftMonth(1));
    this.shadowRoot.getElementById("month-current")?.addEventListener("click", () => {
      this._monthOffset = 0;
      this._renderedHash = null;
      this._render();
    });
  }

  /* ------------------------------------------------------------------ map */

  /** Leaflet's own CSS must be inside the shadow root, see ensureLeafletCss(). */
  _applyLeafletCss() {
    if (!this._leafletCss || this.shadowRoot.getElementById("leaflet-css")) return;
    const style = document.createElement("style");
    style.id = "leaflet-css";
    style.textContent = this._leafletCss;
    this.shadowRoot.prepend(style);
  }

  /** Every coordinate pair of the bundled geometry, split by "everything" and "selected area". */
  _mapPoints(zoneSlug) {
    const all = [];
    const focus = [];
    for (const feature of STREETS.features) {
      const geometry = feature.geometry;
      if (!geometry) continue;
      const rings = geometry.type === "Polygon" ? geometry.coordinates : [geometry.coordinates];
      for (const ring of rings) {
        for (const point of ring) {
          all.push(point);
          if ((feature.properties || {}).zone === zoneSlug) focus.push(point);
        }
      }
    }
    return { all, focus };
  }

  async _renderMap(zone) {
    const container = this.shadowRoot.getElementById("map");
    if (!container) return;
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    // Default: no external requests at all. tile.openstreetmap.org is not intended for
    // embedded maps and blocks them, so tiles only load when they are asked for:
    // either tile_source: ha (Home Assistant proxies and caches the OSM tiles behind a
    // rotating token, sending the User-Agent OSM asks for) or a custom tile_url.
    const source = this._tileSource();
    if (source === "offline") {
      this._renderOfflineMap(container, zone, false);
      return;
    }
    container.classList.remove("offline");
    container.style.removeProperty("--map-max-height");
    container.innerHTML = `<div class="muted" style="padding:10px">${this._t("mapLoading")}</div>`;
    let token = "";
    if (source === "ha") {
      try {
        token = await this._haTilesToken(false);
      } catch (error) {
        // No proxy (older Home Assistant) or no connection: stay dependable.
        this._renderOfflineMap(container, zone, false);
        return;
      }
    }
    let L;
    try {
      L = await ensureLeaflet();
    } catch (error) {
      this._renderOfflineMap(container, zone, false);
      return;
    }
    this._leafletCss = await ensureLeafletCss();
    this._applyLeafletCss();
    container.innerHTML = "";
    this._tileMode = source;
    this._syncTileTheme(container);

    const provider = this._config.tile_attribution ||
      (this._config.tile_url.split("/")[2] || "tiles");
    const attribution = source === "ha"
      ? this._t("mapAttributionHa")
      : this._t("mapAttributionTiles", { provider });
    const map = L.map(container, { scrollWheelZoom: false, attributionControl: true });
    const layer = L.tileLayer(
      source === "ha" ? `${location.origin}${HA_TILES_PATH}` : this._config.tile_url,
      {
        maxZoom: 19,
        attribution: `${attribution} &copy; OpenStreetMap contributors`,
        // Leaflet substitutes every option into the URL template, so the rotating
        // proxy token can be swapped without recreating the layer.
        token,
      }).addTo(map);
    this._renderMapFoot(zone, `${attribution} &copy; OpenStreetMap contributors`);

    let tileErrors = 0;
    let tokenRetried = false;
    layer.on("tileerror", () => {
      tileErrors += 1;
      if (tileErrors < 3) return;
      if (source === "ha" && !tokenRetried) {
        // Core rotates the token every 30 minutes, so a stale one is worth a retry.
        tokenRetried = true;
        tileErrors = 0;
        this._haTilesToken(true).then((next) => {
          if (!next) return;
          layer.options.token = next;
          layer.redraw();
        }).catch(() => {});
        return;
      }
      if (this._config.tile_fallback) {
        layer.off("tileerror");
        this._renderOfflineMap(container, zone, true);
      }
    });

    const bounds = [];      // everything -> fallback view
    const zoneBounds = [];  // selected area -> preferred view
    for (const feature of STREETS.features) {
      const props = feature.properties || {};
      const geometry = feature.geometry;
      if (!geometry) continue;
      const latlngs = geometry.type === "LineString"
        ? geometry.coordinates.map(([lon, lat]) => [lat, lon])
        : null;

      if (props.kind === "rail") {
        L.polyline(latlngs, { color: "#7a7a7a", weight: 2, dashArray: "6 4", opacity: 0.8 })
          .bindTooltip("Badner Bahn").addTo(map);
        continue;
      }
      if (props.kind === "settlement") {
        const rings = geometry.coordinates.map((ring) => ring.map(([lon, lat]) => [lat, lon]));
        const active = props.zone === zone.slug;
        L.polygon(rings, {
          color: ZONE_COLOURS[props.zone] || "#888",
          weight: 1,
          fillColor: ZONE_COLOURS[props.zone] || "#888",
          fillOpacity: active ? 0.28 : 0.12,
        }).bindTooltip(`${props.street} – ${SCHEDULE.zones[props.zone]?.name || ""}`).addTo(map);
        rings.flat().forEach((point) => bounds.push(point));
        if (active) rings.flat().forEach((point) => zoneBounds.push(point));
        continue;
      }
      if (!latlngs) continue;
      const colour = ZONE_COLOURS[props.zone] || "#888";
      const active = props.zone === zone.slug;
      const line = L.polyline(latlngs, {
        color: props.shared ? "#9e9e9e" : colour,
        weight: active ? 5 : 3,
        opacity: active ? 0.95 : 0.35,
        dashArray: props.shared ? "4 4" : null,
      }).addTo(map);
      line.bindTooltip(`${props.street} – ${SCHEDULE.zones[props.zone]?.name || ""}` +
        (props.shared ? ` (${props.part || "geteilt"})` : ""));
      line.on("click", () => {
        if (props.zone && props.zone !== zone.slug) this._setZone(props.zone, true);
      });
      latlngs.forEach((point) => bounds.push(point));
      if (active) latlngs.forEach((point) => zoneBounds.push(point));
    }

    this._map = map;

    // The card was just rendered, so the container may not have its final size yet.
    // fitBounds() would then compute a wrong zoom, so the view is applied explicitly
    // as soon as a sane size is known (checked again on the first resize).
    const target = zoneBounds.length > 4 ? zoneBounds : bounds;
    const applyView = () => {
      const size = map.getSize();
      if (size.x < 80 || size.y < 80 || !target.length) return false;
      const box = L.latLngBounds(target);
      map.setView(box.getCenter(), map.getBoundsZoom(box, false, L.point(24, 24)),
                  { animate: false });
      return true;
    };
    if (!applyView()) setTimeout(applyView, 150);

    this._resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
      if (!this._viewApplied) this._viewApplied = applyView();
    });
    this._resizeObserver.observe(container);
    map.on("dragstart", () => { this._viewApplied = true; });
  }

  /**
   * Tile-less map: the bundled street geometry is drawn as SVG. No network access,
   * nothing to be blocked - this is the default because tile.openstreetmap.org
   * blocks embedded/third-party usage.
   */
  _renderOfflineMap(container, zone, tilesBlocked) {
    const { all, focus } = this._mapPoints(zone.slug);
    const use = focus.length > 8 ? focus : all;
    if (!use.length) {
      container.innerHTML = "";
      return;
    }

    const lats = use.map((point) => point[1]);
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const shrink = Math.cos((midLat * Math.PI) / 180);   // keep the aspect ratio
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [lon, lat] of use) {
      minX = Math.min(minX, lon * shrink);
      maxX = Math.max(maxX, lon * shrink);
      minY = Math.min(minY, lat);
      maxY = Math.max(maxY, lat);
    }
    const padX = (maxX - minX || 0.002) * 0.10;
    const padY = (maxY - minY || 0.002) * 0.10;
    minX -= padX; maxX += padX; minY -= padY; maxY += padY;
    const width = maxX - minX;
    const height = maxY - minY;
    const svgHeight = 1000 * (height / width);
    const project = ([lon, lat]) => [
      (((lon * shrink) - minX) / width) * 1000,
      ((maxY - lat) / height) * svgHeight,
    ];
    const toPath = (ring, close) => ring
      .map((point, index) => {
        const [x, y] = project(point);
        return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + (close ? " Z" : "");

    const parts = [];
    const centroids = {};
    for (const feature of STREETS.features) {
      const props = feature.properties || {};
      const geometry = feature.geometry;
      if (!geometry) continue;
      const zoneName = SCHEDULE.zones[props.zone]?.name || "";
      if (props.zone) {
        const ring = geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
        const middle = ring[Math.floor(ring.length / 2)];
        const bucket = (centroids[props.zone] = centroids[props.zone] || { x: 0, y: 0, n: 0 });
        const [x, y] = project(middle);
        bucket.x += x; bucket.y += y; bucket.n += 1;
      }
      if (props.kind === "rail") {
        parts.push(`<path d="${toPath(geometry.coordinates, false)}" fill="none" stroke="#8d8d8d"` +
          ` stroke-width="2.5" stroke-dasharray="10 7" opacity=".8"><title>Badner Bahn</title></path>`);
        continue;
      }
      if (props.kind === "settlement") {
        const active = props.zone === zone.slug;
        const colour = ZONE_COLOURS[props.zone] || "#999";
        parts.push(`<path d="${toPath(geometry.coordinates[0], true)}" fill="${colour}"` +
          ` fill-opacity="${active ? 0.3 : 0.13}" stroke="${colour}" stroke-width="1.5"` +
          ` data-map-zone="${props.zone}"><title>${props.street} – ${zoneName}</title></path>`);
        continue;
      }
      const active = props.zone === zone.slug;
      const colour = props.shared ? "#9e9e9e" : (ZONE_COLOURS[props.zone] || "#999");
      parts.push(`<path d="${toPath(geometry.coordinates, false)}" fill="none" stroke="${colour}"` +
        ` stroke-width="${active ? 4.5 : 2.5}" stroke-opacity="${active ? 0.95 : 0.4}"` +
        ` stroke-linecap="round" stroke-linejoin="round"` +
        `${props.shared ? ' stroke-dasharray="6 4"' : ""}` +
        ` data-map-zone="${props.zone}">` +
        `<title>${props.street} – ${zoneName}${props.shared ? ` (${props.part || "geteilt"})` : ""}</title>` +
        "</path>");
    }

    const labels = Object.entries(centroids)
      .filter(([, bucket]) => bucket.n)
      .map(([slug, bucket]) => {
        const [x, y] = [bucket.x / bucket.n, bucket.y / bucket.n];
        return `<text class="zone-label" x="${x.toFixed(0)}" y="${y.toFixed(0)}"` +
          ` data-map-zone="${slug}">${SCHEDULE.zones[slug]?.name || slug}</text>`;
      });

    const centre = [(minY + maxY) / 2, (minX + maxX) / 2 / shrink];
    this._tileMode = null;
    container.classList.add("offline");
    container.classList.remove("dark-tiles");
    container.style.setProperty("--map-max-height",
      `${Math.max((this._config.map_height || 320) * 2, 480)}px`);
    container.innerHTML = `
      <svg viewBox="0 0 1000 ${svgHeight.toFixed(0)}" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="${this._t("map")}">
        <rect x="0" y="0" width="1000" height="${svgHeight.toFixed(0)}"
              fill="var(--secondary-background-color, #f2f2f2)"/>
        ${parts.join("")}
        ${labels.join("")}
      </svg>`;
    this._renderMapFoot(zone, `${this._t("mapAttribution")} · ${this._t("mapOffline")}`, {
      link: `<a href="https://www.openstreetmap.org/#map=14/${centre[0].toFixed(5)}/${centre[1].toFixed(5)}"` +
        ` target="_blank" rel="noopener">${this._t("openInOsm")}</a>`,
      notice: tilesBlocked ? this._t("mapTilesBlocked") : "",
    });
  }

  /** Tile mode requested by the configuration. */
  _tileSource() {
    if ((this._config.tile_source || "").toLowerCase() === "ha") return "ha";
    if (this._config.tile_url) return "custom";
    return "offline";
  }

  /**
   * The built-in map does not load tiles from OpenStreetMap directly: core proxies
   * and caches them and sends the identifying User-Agent that the OSM tile policy
   * asks for, which a browser cannot send. Asking the instance for a token therefore
   * gives us the same tiles without ever tripping the anti-abuse block.
   */
  async _haTilesToken(force) {
    const connection = this._hass && this._hass.connection;
    if (!connection || !connection.sendMessagePromise) {
      throw new Error("Home Assistant connection unavailable");
    }
    if (!force && this._haToken) return this._haToken;
    const result = await connection.sendMessagePromise({ type: "map_tiles/access_token" });
    this._haToken = (result && result.token) || "";
    return this._haToken;
  }

  /** Raster tiles are inverted in dark mode, exactly like the built-in map does. */
  _syncTileTheme(container) {
    this._darkTiles = Boolean(this._hass && this._hass.themes && this._hass.themes.darkMode);
    container.classList.toggle("dark-tiles", this._darkTiles);
  }

  /** Legend and attribution below the map, shared by the SVG and the tile map. */
  _renderMapFoot(zone, attribution, options = {}) {
    const foot = this.shadowRoot.getElementById("map-foot");
    if (!foot) return;
    const legend = Object.entries(SCHEDULE.zones).map(([slug, info]) => {
      const days = TYPE_ORDER.filter((type) => info.weekday?.[type])
        .map((type) => `${SCHEDULE.legend[type].short}: ${this._weekdayName(info.weekday[type])}`)
        .join(" · ");
      return `<span class="zone-key${slug === zone.slug ? " active" : ""}" data-map-zone="${slug}">` +
        `<span class="swatch" style="background:${ZONE_COLOURS[slug]}"></span>${info.name}` +
        `<span class="muted">${days}</span></span>`;
    }).join("");
    foot.innerHTML = `
      <div class="zone-legend">${legend}</div>
      <div class="map-attr"><span>${attribution}</span>${options.link || ""}</div>` +
      (options.notice ? `<div class="notice" style="margin-top:4px">${options.notice}</div>` : "");

    this.shadowRoot.querySelectorAll("[data-map-zone]").forEach((node) => {
      const slug = node.dataset.mapZone;
      if (SCHEDULE.zones[slug] && slug !== this._zone) {
        node.style.cursor = "pointer";
        node.addEventListener("click", () => this._setZone(slug, true));
      }
    });
  }

  disconnectedCallback() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }
}

/* A second evaluation of this module (manual install next to a HACS copy, or a cached
   and a fresh file) must not throw "the name has already been used with this registry". */
if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, VoesendorfWasteCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Vösendorf Abfallkalender",
    description: "Müllabfuhrkalender der Marktgemeinde Vösendorf mit Karte und Jahresübersicht",
    preview: false,
    documentationURL: "https://github.com/acdcnow/voesendorf-wastecalendar",
  });
}

console.info(`%c ${CARD_TYPE} %c v${VERSION} `, "color:white;background:#3f9e8f", "color:#3f9e8f;background:white");
