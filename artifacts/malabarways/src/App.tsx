import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter, Link, useRoute } from 'wouter';
import { ArrowRight, Menu, X, MessageCircle, ChevronRight, MapPin, Clock3, Plane, TrainFront, ArrowUpRight, Sparkles, Compass, Star, Check } from 'lucide-react';
import logo from '@assets/logo_1792901386678.png';

const queryClient = new QueryClient();
const phone = '919496885372';
const wa = (context: string) => `https://wa.me/${phone}?text=${encodeURIComponent(`Hello Malabar Ways, I would love to enquire about ${context}.`)}`;
const slugify = (s: string) => s.toLowerCase().replace(/[()]/g, '').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
type Destination = { name: string; tagline: string; duration: string; airport?: string; rail?: string; transport?: string; intro: string; highlights?: string[]; itinerary: string[]; video?: string; season?: string };
const destinationImages: Record<string, string> = {
  hyderabad: '/images/hyderabad.webp',
  goa: '/images/goa.jpg',
  hampi: '/images/hampi.jpg',
  mysore: '/images/mysore.jpg',
  coorg: '/images/coorg.jpg',
  chikmagalur: '/images/chikmagalur.jpg',
  'gulbarga-kalaburagi': '/images/gulbarga.jpg',
  'ooty-coonoor': '/images/ooty.jpg',
  'ooty-and-coonoor': '/images/ooty.jpg',
  madurai: '/images/madurai.jpg',
  kanyakumari: '/images/kanyakumari.webp',
  kayalpattanam: '/images/kayalpattanam.jpg',
  kochi: '/images/kochi.jpg',
  muziris: '/images/muziris.jpg',
  alappuzha: '/images/alappuzha.jpg',
  kumarakom: '/images/kumarakom.jpg',
  munnar: '/images/munnar.jpg',
  thekkady: '/images/thekkady.jpg',
  trivandrum: '/images/trivandrum.jpg',
  kovalam: '/images/kovalam.jpg',
  'calicut-kozhikode': '/images/calicut.jpg',
  kannur: '/images/kannur.jpg',
  thalassery: '/images/thalassery.jpg',
  kasaragod: '/images/malabar-coast.jpg',
  wayanad: '/images/wayanad.jpg',
  nilambur: '/images/nilambur.jpg',
  palakkad: '/images/palakkad.jpg',
  thrissur: '/images/thrissur.jpg',
  ponnani: '/images/ponnani.jpg',
  tirunavaya: '/images/tirunavaya.jpg',
};
const destinationImage = (destination: Destination) =>
  destinationImages[slugify(destination.name)] ?? '/images/south-heritage.jpg';
const south: Destination[] = [
{name:'Hyderabad',tagline:'The City of Pearls & Nawabi Charm',duration:'2 to 3 days',airport:'Rajiv Gandhi International Airport, Hyderabad (HYD)',intro:'A royal blend of regal heritage, mouthwatering culinary traditions and vibrant bazaar culture, where old-world royalty meets modern sophistication.',itinerary:['Day 1 · Guided walk through Charminar and Laad Bazaar; Irani chai and Osmania biscuits at a historic café; Hyderabadi biriyani for dinner.','Day 2 · Golconda Fort and its evening sound-and-light show, Qutb Shahi Tombs and Chowmahalla Palace.','Day 3 · Optional visit to Ramoji Film City or leisure shopping before departure.']},
{name:'Goa',tagline:'Sun, Spice & Colonial Charm',duration:'3 to 4 days',airport:'Dabolim Airport (GOI) or Manohar International Airport, Mopa (GOX)',rail:'Konkan Railway network',intro:'Goa is more than beaches: Portuguese heritage, lush hinterlands, coastal gastronomy and tranquil river cruises make a sensory escape.',itinerary:['Day 1 · Arrive at a seaside resort, unwind on the coast and enjoy fresh seafood with live beach music.','Day 2 · Walk Fontainhas in Panjim and visit the Old Goa churches, including Basilica of Bom Jesus and Se Cathedral.','Day 3 · Organic spice plantation, traditional Goan buffet and sunset cruise on the Mandovi River.','Day 4 · Leisurely breakfast, optional water sports or beach time, then airport transfer.'],season:'November to February'},
{name:'Hampi',tagline:'The Timeless Kingdom of Stone',duration:'2 to 3 days',airport:'Jindal Vijayanagar Airport (VDY), Hubballi (HBX) or Bengaluru (BLR)',rail:'Hosapete Junction (HPT)',intro:'A UNESCO World Heritage landscape where boulder-strewn hills frame the magnificent ruins of the Vijayanagara Empire.',itinerary:['Day 1 · Arrive via Hosapete, visit active Virupaksha Temple and take a coracle ride across the Tungabhadra at sunset.','Day 2 · Explore Vittala Temple, the Stone Chariot and musical pillars, Lotus Mahal, Elephant Stables and Royal Enclosure.','Day 3 · Sunrise from Matanga Hill before your return transfer.']},
{name:'Mysore',tagline:'Royal Grandeur & Fragrant Heritage',duration:'2 days',airport:'Mysore Airport (MYQ) or Bengaluru (BLR), about 3 hours by road',rail:'Direct rail link',intro:'Karnataka’s cultural capital is known for grand palaces, fragrant sandalwood, silk weaving and traditional sweets such as Mysore Pak.',itinerary:['Day 1 · Private pickup from Bengaluru or Mysore, Mysore Palace, silk and sandalwood markets, then the palace illumination.','Day 2 · Chamundi Hill, Chamundeshwari Temple and colossal Nandi; St. Philomena’s Church and historic Seringapatam before departure.']},
{name:'Coorg',tagline:'Misty Estates & Kodava Culture',duration:'2 to 3 days',airport:'Kannur (CNN), Mangaluru (IXE) or Bengaluru (BLR)',transport:'Private chauffeur transfers from Mysuru or Bengaluru; no direct rail or airport.',intro:'The Western Ghats offer serene coffee plantations, cool mountain air, welcoming homestays and the distinctive culture and cuisine of Kodagu.',itinerary:['Day 1 · Chauffeur pickup, scenic drive into the hills and plantation homestay; walk through coffee and spice estates.','Day 2 · Namdroling Monastery at Bylakuppe, Abbey Falls and sunset at Raja’s Seat; taste Kodava Pandi Curry and Kadambuttu.','Day 3 · Morning birdwatching or plantation trek, then private drive onwards.']},
{name:'Chikmagalur',tagline:'Coffee Hills & Sacred Peaks',duration:'2 to 3 days',airport:'Mangaluru International Airport (IXE) or Bengaluru (BLR)',intro:'Known as the birthplace of Indian coffee, Chikmagalur brings rugged mountain trails, waterfalls and spiritual sites tucked into green forest.',itinerary:['Day 1 · Wind through hill roads to your resort; fresh coffee tasting and a nature walk.','Day 2 · Jeep safari to Mullayanagiri, Karnataka’s highest peak; Baba Budangiri shrine, revered by Hindu and Muslim pilgrims, and Jhari Waterfalls.','Day 3 · Visit a historic coffee processing estate before your return drive.']},
{name:'Gulbarga (Kalaburagi)',tagline:'Sultanate Forts & Sufi Heritage',duration:'1 to 2 days',airport:'Kalaburagi Airport (GBI)',rail:'Kalaburagi Junction (KLBG)',intro:'The Bahmani Sultanate’s first capital offers striking Islamic architecture, historic mosques, forts and sacred Sufi shrines.',itinerary:['Day 1 · Guided visit to medieval Gulbarga Fort and its grand Jami Masjid, built in a rare Spanish-Moorish style.','Day 2 · Bande Nawaz Dargah and the Khwaja Bande Nawaz tomb complex before your outbound flight or train.']},
{name:'Ooty & Coonoor',tagline:'Queen of Hill Stations & Toy Train Journeys',duration:'3 days',airport:'Coimbatore International Airport (CJB)',rail:'Mettupalayam connects with the Nilgiri Mountain Railway',intro:'Travel into the Nilgiri hills through tea plantations, cool climate and pine forests, with a ride on the historic UNESCO-listed toy train.',itinerary:['Day 1 · Pickup from Coimbatore or Mettupalayam, scenic Ghat drive, Ooty Botanical Gardens and Ooty Lake.','Day 2 · Nilgiri Mountain Railway ride to Coonoor, Sim’s Park, Dolphin’s Nose and a working tea factory.','Day 3 · Doddabetta Peak for blue mountain vistas before your onward transfer.']},
{name:'Madurai',tagline:'The Eternal Temple City',duration:'2 days',airport:'Madurai Airport (IXM)',rail:'Madurai Junction (MDU)',intro:'One of South India’s oldest continuously inhabited cities, famous for soaring temple towers, fragrant jasmine and late-night street food.',itinerary:['Day 1 · Thirumalai Nayakkar Palace, evening Meenakshi Amman Temple ceremony and midnight street-food walk for Jigarthanda, Kari Dosa and parottas.','Day 2 · Flower markets filled with Madurai jasmine and Gandhi Memorial Museum before departure.']},
{name:'Kanyakumari',tagline:'Where Three Seas Meet',duration:'1 to 2 days',airport:'Trivandrum International Airport (TRV), about 90 km',rail:'Kanyakumari Railway Station (CAPE)',intro:'At mainland India’s southernmost tip, the Arabian Sea, Bay of Bengal and Indian Ocean converge in spectacular sunrises and sunsets.',itinerary:['Day 1 · Ferry to Vivekananda Rock Memorial and Thiruvalluvar Statue; sunset at the meeting of the three seas.','Day 2 · Sunrise on the coast and Padmanabhapuram Palace en route to Trivandrum airport.']},
{name:'Kayalpattanam',tagline:'Coastal Sufi Heritage & Marine Serenity',duration:'1 to 2 days',airport:'Tuticorin (TCR), about 30 km, or Trivandrum (TRV), about 150 km',rail:'Arumuganeri (3 km), Tiruchendur or Thoothukudi',intro:'An ancient coastal gem of maritime trade, tranquil beaches and deep Sufi heritage, offering a peaceful escape beyond the usual routes.',itinerary:['Day 1 · Heritage walk through traditional coastal streets and Sufi shrines; sunset at quiet Kayalpattanam Beach.','Day 2 · Coastal landmarks such as Manapad cove viewpoints or Tiruchendur before departure.']}
];
const kerala: Destination[] = [
{name:'Kochi',tagline:'The Cosmopolitan Queen of the Arabian Sea',duration:'2 to 3 days',airport:'Cochin International Airport (COK)',rail:'Ernakulam Junction (ERS) and Ernakulam Town (ERN)',intro:'A living tapestry of maritime history, global spice trade and diverse cultures. Walk past Chinese fishing nets, explore Jew Town and experience Kathakali.',video:'V2ZPN0R0VUY',itinerary:['Day 1 · Fort Kochi heritage and cultural evening: airport pickup, Fort Kochi beach and Chinese fishing nets at sunset, St. Francis Church, then Kathakali with backstage makeup viewing.','Day 2 · Mattancherry spice lanes: Paradesi Synagogue, Jew Town antiques, Dutch Palace murals and a sunset harbour cruise.','Day 3 · Breakfast, authentic Malabar spices and handlooms at Broadway, then timely transfer to COK.']},
{name:'Muziris',tagline:'The Cradle of Ancient Global Trade',duration:'1 day',airport:'Cochin International Airport (COK), about 35 km',transport:'Private vehicle and authorized Muziris Heritage water taxis.',intro:'Step back over 2,000 years to the port where Roman gold was exchanged for Malabar black pepper. Archaeological sites and sacred monuments reveal Kerala’s global trading heritage.',video:'cOzzAhVA01s',itinerary:['Day 1 · North Paravur, Paravur Jewish Synagogue and Heritage Museum; heritage water taxi along Periyar canals to Pattanam excavation site.','Afternoon · Cheraman Juma Masjid, traditionally recognized as India’s first mosque, and a banana-leaf Kerala sadhya.','Evening · Paliam Palace and Nalukettu, ancestral home of the Paliath Achans, before departure.']},
{name:'Alappuzha',tagline:'The Venice of the East',duration:'2 days',airport:'Cochin International Airport (COK)',rail:'Alappuzha Railway Station (ALLP)',transport:'Private houseboats and traditional wooden village canoes (Shikaras).',intro:'Float past green paddy fields, coconut groves and rural riverside life aboard a traditional Kettuvallam houseboat.',highlights:['Vembanad Lake overnight houseboats','Village canoe rides','Toddy shops beside paddy fields'],video:'xeWtgeO0nKg',itinerary:['Day 1 · Board your private Kettuvallam at noon with personal crew and chef; cruise Punnamada Lake and narrow canals, enjoy Karimeen fish fry and dinner under the stars.','Day 2 · Sunrise Shikara canoe through inland streams; visit a local coir-weaving cottage industry before transfer.']},
{name:'Kumarakom',tagline:'Lakeside Luxury & Bird Sanctuary',duration:'2 days',airport:'Cochin International Airport (COK), about 80 km',rail:'Kottayam Railway Station (KTYM), about 15 km',transport:'Private resort speedboats, country canoes and private cabs.',intro:'On Vembanad Lake’s eastern banks, Kumarakom is a haven of lakeside living, birdlife and Syrian Christian flavours such as duck curry and fish pollichathu.',highlights:['Lakeside eco-resorts','Bird-rich wetland sanctuary','Syrian Christian culinary traditions'],video:'vLN2pNMl-S4',itinerary:['Day 1 · Lakeside resort or heritage villa, restorative Ayurvedic session, private Vembanad sunset cruise and Syrian Christian coastal dinner.','Day 2 · Guided morning boat safari through Kumarakom Bird Sanctuary; village walk to learn about toddy tapping and coir rope making.']},
{name:'Munnar',tagline:'Rolling Emerald Hills & Mist-Kissed Slopes',duration:'2 to 3 days',airport:'Cochin International Airport (COK), about 110 km / 3.5–4 hours',rail:'Aluva (AWY) or Ernakulam (ERS)',transport:'Private AC sedan or SUV with experienced hill drivers.',intro:'At 1,600 metres in the Western Ghats, Munnar is a sweep of tea plantations, waterfalls and cool mountain air; home of the endangered Nilgiri Tahr.',highlights:['Tea slopes and KDHP Tea Museum','Eravikulam National Park','High-altitude mountain trails'],video:'vUDx64AgSNU',itinerary:['Day 1 · Pickup from Kochi, Cheeyappara Waterfalls and spice plantations; valley-view resort and KDHP Tea Museum with fresh tea tasting.','Day 2 · Eravikulam National Park for Nilgiri Tahr, Mattupetty Dam, Kundala Lake and Echo Point; browse the town bazaar.','Day 3 · Optional sunrise jeep safari to Top Station before onward travel.']},
{name:'Thekkady',tagline:'Wildlife Safaris & Spice Plantations',duration:'2 days',airport:'Madurai (IXM), about 140 km / 3 hours, or Cochin (COK), about 150 km / 4 hours',rail:'Kottayam Railway Station (KTYM)',transport:'Private cars and authorized forest department safari jeeps.',intro:'An escape into evergreen forests, fragrant organic spice gardens and wildlife in the Cardamom Hills, centred on Periyar Tiger Reserve.',highlights:['Periyar Lake boat safaris','Organic spice plantation tours','Live Kalaripayattu presentations'],video:'3ZbbTkAoWCs',itinerary:['Day 1 · Scenic drive into the spice hills, wilderness lodge and official Periyar Lake boat safari for elephants, gaur, sambar and water birds; evening Kalaripayattu presentation.','Day 2 · Guided spice plantation walk to discover pepper, cardamom, vanilla and cinnamon; Kumily market and departure.']},
{name:'Trivandrum',tagline:'Royal Capital & Heritage Lanes',duration:'2 days',airport:'Trivandrum International Airport (TRV), within the city',rail:'Thiruvananthapuram Central (TVC)',intro:'Kerala’s historic capital blends spiritual heritage, Indo-Saracenic architecture, Travancore woodwork and peaceful museum gardens.',highlights:['Sree Padmanabhaswamy Temple','Napier Museum','Travancore palace architecture'],video:'f1l62b4bj3w',itinerary:['Day 1 · Sree Padmanabhaswamy Temple, Kuthiramalika Palace Museum, Napier Museum lawns and Kanakkakunnu Palace grounds.','Day 2 · Chitra Art Gallery for works by Raja Ravi Varma, then Chalai Bazaar before departure.']},
{name:'Kovalam',tagline:'Crescent Beaches & Seaside Ayurveda',duration:'2 to 3 days',airport:'Trivandrum International Airport (TRV), about 16 km / 25 minutes',rail:'Thiruvananthapuram Central (TVC), about 15 km',transport:'Private airport and city transfers; pedestrian-friendly beach promenades.',intro:'End your South Indian journey on iconic crescent beaches, cliffside dining and coastal Ayurveda.',highlights:['Crescent golden beaches','Historic lighthouse views','Oceanfront Ayurvedic rejuvenation'],video:'nxqSpiGglkU',itinerary:['Day 1 · Beach resort or cliff-edge spa, Lighthouse Beach and Vizhinjam Lighthouse; seafood dinner overlooking the Arabian Sea.','Day 2 · Certified Ayurvedic massage, Hawa and Samudra beaches, optional catamaran with local fishermen and Vizhinjam Rock-Cut Cave Temple.','Day 3 · Ocean-side leisure and transfer to Trivandrum Airport.']}
];
const malabar: Destination[] = [
{name:'Calicut (Kozhikode)',tagline:'Where History Meets the Flavours of Malabar',duration:'2–3 days',airport:'Calicut International Airport',rail:'Kozhikode railway station',intro:'Once a celebrated Indian Ocean spice-trade port, Calicut welcomes you with historic streets, beaches, traditional markets and legendary cuisine.',video:'f7gUZPl0lg4',highlights:['Mishkal Mosque and Kuttichira heritage area','Beypore and traditional wooden shipbuilding yards','Mananchira Square and SM Street','Kozhikode Beach and historic market streets'],itinerary:['Taste authentic Malabar biriyani and local snacks.','Explore heritage streets and traditional markets.','Discover Beypore’s centuries-old boatbuilding craft.','Enjoy sunset by the Arabian Sea.']},
{name:'Kannur',tagline:'Discover the Land of Theyyam and Coastal Traditions',duration:'2–3 days',airport:'Kannur International Airport',rail:'Kannur railway station',intro:'Ancient rituals, royal histories, handloom traditions and beautiful coastlines meet in Kannur. Experience Theyyam during its season and meet craftspeople.',video:'pCoK623T3ms',highlights:['St. Angelo Fort','Arakkal Museum','Muzhappilangad Drive-in Beach','Theyyam shrines and handloom centres'],itinerary:['Witness a Theyyam ritual, subject to local schedules.','Explore Kannur’s handloom heritage.','Visit coastal villages and historic forts.','Discover seafood and Malabar cuisine.'],season:'Theyyam is mostly seen from late autumn to spring.'},
{name:'Thalassery',tagline:'A Small Town with Big Stories',duration:'1–2 days',airport:'Kannur International Airport',rail:'Thalassery railway station',intro:'A coastal town known for colonial history, famous biriyani, distinctive cakes and its contribution to Indian cricket and circus traditions.',video:'4Frk41kMrwY',highlights:['Thalassery Fort','Overbury’s Folly','Historic town and market streets','Local bakeries and traditional food spots'],itinerary:['Taste authentic Thalassery biriyani and local cakes.','Explore colonial-era heritage.','Discover cricket and circus history.','Enjoy coastal scenery and local markets.']},
{name:'Kasaragod',tagline:'Forts, Backwaters and the Quiet Beauty of North Malabar',duration:'2 days',airport:'Kannur International Airport or Mangaluru International Airport',rail:'Kasaragod railway station',intro:'At Kerala’s northern edge, discover a peaceful blend of coastal landscapes, historic forts, traditional communities and scenic waterways.',video:'58vxuyZAav0',highlights:['Bekal Fort and Bekal Beach','Chandragiri Fort and river viewpoints','Kappil Beach and backwaters','Historic temples and local heritage sites'],itinerary:['Explore coastal forts and historic landmarks.','Enjoy backwater scenery and boat experiences where available.','Discover local food and cultural traditions.','Photograph beaches, rivers and sunsets.']},
{name:'Wayanad',tagline:'Into the Mountains, Forests and Stories of the Land',duration:'2–3 days',airport:'Calicut International Airport, followed by 3–4 hour drive depending on destination',transport:'Accessible by road from Mysuru and Bengaluru.',intro:'Misty hills, forest, waterfalls and ancient rock shelters invite you to slow down. Discover engravings, spice-growing regions and local food traditions.',video:'l4TelPR_Mzg',highlights:['Edakkal Caves and ancient engravings','Banasura Sagar Dam','Soochipara and other accessible waterfalls','Viewpoints and selected tribal heritage experiences'],itinerary:['Nature walks and mountain viewpoints.','Explore caves and archaeological heritage.','Taste local food and regional specialities.','Discover spice plantations and village life.']},
{name:'Nilambur',tagline:'Into the World of Teak Forests and Village Crafts',duration:'1–2 days',airport:'Calicut International Airport',rail:'Nilambur Road railway station',intro:'Surrounded by forests and the Chaliyar River, Nilambur offers teak heritage, green landscapes, riverside villages and traditional pottery.',video:'5Yrw-m0ociE',highlights:['Nilambur Teak Museum','Conolly’s Plot','Chaliyar River','Pottery workshops and craft villages'],itinerary:['Learn about teak and forestry history.','Enjoy nature walks and river scenery.','Join a pottery workshop where available.','Discover village life and traditional craftsmanship.']},
{name:'Palakkad',tagline:'Green Paddy Fields, Historic Forts and Village Life',duration:'2 days',airport:'Coimbatore International Airport',rail:'Palakkad Junction railway station',intro:'Wide paddy fields, mountain landscapes and distinctive cultural traditions. Explore the historic fort, Kalpathy heritage and quiet countryside.',video:'duGEQ5eSQ1g',highlights:['Palakkad Fort','Kalpathy heritage streets','Malampuzha Dam and gardens','Paddy fields and countryside villages'],itinerary:['Explore historic landmarks and traditional streets.','Discover local cuisine and cultural traditions.','Enjoy gardens, reservoirs and countryside views.','Experience agricultural landscapes and village life.']},
{name:'Thrissur',tagline:'Experience Kerala’s Festival Spirit and Cultural Heritage',duration:'1–2 days',airport:'Cochin International Airport',rail:'Thrissur railway station',intro:'A vibrant centre for Kerala’s arts, temple traditions and festivals, known for Thrissur Pooram, historic architecture and museums.',video:'sOAwF6EMoDc',highlights:['Vadakkunnathan Temple','Kerala Kalamandalam','Shakthan Thampuran Palace','Thrissur Pooram festival grounds'],itinerary:['Discover Kerala’s classical performing arts.','Explore historic landmarks and museums.','Experience Thrissur Pooram when it takes place.','Taste traditional vegetarian Kerala dishes.']},
{name:'Ponnani',tagline:'Discover the Coastal Town of Scholars, Sailors and Stories',duration:'1 day',airport:'Calicut International Airport, about 1–1.5 hours by road',rail:'Tirur railway station',intro:'A historic Malabar port known for Islamic learning, maritime connections, fishing communities and river landscapes.',video:'e3FcVNwBpOQ',highlights:['Ponnani Juma Masjid','Ponnani harbour and fishing areas','Bharathappuzha estuary','Historic neighbourhoods and coastal viewpoints'],itinerary:['Discover maritime and educational heritage.','Explore mosques and historic neighbourhoods respectfully.','Taste traditional Malabar seafood.','Experience harbour life and coastal scenery.']},
{name:'Tirunavaya',tagline:'Where the River Holds Centuries of History',duration:'Half-day to 1 day',airport:'Calicut International Airport, about 1–1.5 hours by road',rail:'Tirur railway station',intro:'On the Bharathappuzha River, Tirunavaya is associated with the ancient Mamankam festival. Riverbanks and religious landmarks open a window into Kerala’s past.',highlights:['Tirunavaya Navamukunda Temple','Historic Mamankam festival grounds','Bharathappuzha riverbank','Nearby heritage villages'],itinerary:['Learn about the Mamankam festival.','Explore riverside heritage and religious traditions.','Enjoy the quiet Bharathappuzha landscape.','Combine with nearby Malappuram heritage destinations.']}
];

type Experience = {title:string;slug:string;tagline:string;copy:string;where:string;duration:string;video?:string;season?:string;points?:string[]};
const experiences: Experience[] = [
{title:'A Journey Through the Flavours of Malabar',slug:'food',tagline:'The stories of a region, served at its tables',copy:'Discover Malabar through food, where every dish carries history, culture and tradition. From aromatic biriyanis and freshly caught seafood to snacks, spices and homemade sweets, explore local markets, taste regional dishes and meet the people behind the flavours. Each table is shaped by what the host kitchen cooks best, so menus change with season, home and hand.',where:'Calicut, Kannur, Wayanad',duration:'A half-day or full-day tasting journey',points:['Breakfast · Pathiri, Ney Pathiri, Erachi Pathiri, Kunji Pathal, Madakk Pathiri, Puttu, Dosa, Ottada, Aleesa, Porotta, Noolputtu and Muttappam','Lunch · Biriyani, Thenga Choru, Ney Choru, Sadhya and Kappa Beef','Tea-time · Unnakkaya, Irachi Pathal, Elanchi, Pazham Nirachathu, Kozhi Ada, Egg Fry, Kai Pola, Mutta Mala, Ela Ada, Chemmeen Unda, Carrot Pola, Bread Pocket, Kallumakkaya, halwa and Payyoli Mixture']},
{title:'Kaalappoottu',slug:'kaalappoottu',tagline:'Where the paddy field becomes the stage',copy:'Feel the excitement of Malabar’s traditional bull races, where farmers, powerful bulls and muddy paddy fields come together in a thrilling rural sport. Kaalappoottu is part of farming heritage, bringing villages together through competition and a deep connection with land and animals. Meet local farmers, learn the tradition and experience a sporting culture rarely seen by visitors.',where:'Malappuram and Palakkad paddy lands',duration:'Half-day or full-day · Seasonal',video:'tjl2CBj7-Ho',season:'Dates follow local agricultural and community calendars.',points:['Witness the speed of bulls racing through muddy paddy fields.','Discover the animals’ role in traditional farming and rural life.','Meet farmers and hear the stories behind the competition.','Experience the people and village culture around race day.']},
{title:'Theyyam Trails',slug:'theyyam',tagline:'Step into the world of gods, rituals and living traditions',copy:'Discover one of North Kerala’s most extraordinary ritual traditions. As drums begin, vivid costumes come alive and performers transform into divine figures. With Malabar Ways, explore sacred groves and village shrines, learn the stories behind the deities, meet local people and understand the traditions that have shaped Malabar for generations.',where:'North Malabar, Kerala',duration:'Half-day or full-day · Seasonal',video:'jqKKxZwwHRY',season:'Theyyam is mostly seen from late autumn to spring. Events follow local shrine calendars.',points:['Learn the meaning of the deities and ritual traditions.','Visit village shrines with a local host and community consent.','Attend a ritual when the local calendar and community allow.','Respectful photography guidance is provided.']},
{title:'Sevens Football & Mud Football',slug:'sevens-football-malabar',tagline:'Malabar plays football like nowhere else',copy:'Picture a floodlit village ground, packed from touchline to treetops, with thousands of voices rising as seven players a side chase one ball. Sevens is faster and fiercer than the familiar game, filling grounds across Malappuram, Calicut, Kannur, Wayanad and Kasaragod. A local fan host guides you to a safe seat, explains clubs and chants, and shares match-night snacks and tea. Sevens grew from post-harvest paddy-field games into a season of tournaments, often raising money for charity.',where:'Malabar football grounds',duration:'Sevens evenings November to May · Mud football roughly June to September',video:'NxGPpLIQf-0',season:'Sevens: November–May. Mud football: monsoon, roughly June–September.',points:['Join a local fan host for a match night.','Learn about the clubs, chants and the game’s village roots.','Meet fans, organisers and, when possible, players.','Explore a village ground before the floodlights come on.']},
{title:'Mappila & Malabar Arts',slug:'mappila-malabar-arts',tagline:'Meet the arts where they live',copy:'Malabar’s arts were made for weddings, welcomes, festivals and prayer, not the stage. In Mappila homes, songs and dances carry Arabic, Tamil and Malayalam in one breath, alongside the martial, ritual and folk arts of wider Malabar. Meet artists in their homes, courtyards and village groves. Choose a curated session arranged for your dates or attend a live community event by invitation.',where:'Calicut, Malappuram, Kannur and North Malabar',duration:'Curated sessions year-round · Live dates follow local calendars',video:'',points:['Oppana · Bridal song and dance, with women singing and clapping in a circle around the seated bride; styles include Chayal and Murukkam.','Arabana Muttu · Drummers sway, toss and catch the small single-sided hand drum in a rhythm of welcome and honour.','Kolkali · Dancers move in shifting circles, striking decorated sticks; Mappila forms open with prayer and draw on Kalarippayattu stepwork.','Paricha Muttu · A martial performance of shields and swords, led by a master, with steps from Kalarippayattu.','Vattappattu · Wedding-night circle singing, call and response, handclaps and friendly contest.','Muttippattu · Clap-led Mappila songs, closely tied to wedding gatherings.','Cheeni Muttu & Kuthu Ratib · Devotional traditions approached as invited guests, to listen and learn; participation in ritual is not offered.','Thira · Sacred-grove dance drama in South Malabar, with painted faces, coconut-leaf skirts and brass headgear. Seasonal.','Poorakkali · North Malabar temple dance around a lamp, performed in Meenam, around March and April.']},
{title:'Malabar Henna Art',slug:'henna',tagline:'Wear a little art. Take home a beautiful memory.',copy:'Discover henna, a natural art cherished in Malabar’s wedding and festive traditions. Sit with local artists as they turn your hands into canvases with delicate patterns inspired by regional designs. Hear stories behind the art and enjoy a warm cultural encounter.',where:'Calicut, Kannur and Malappuram',duration:'1–2 hours'},
{title:'Traditional Pottery Workshop',slug:'pottery',tagline:'Get your hands dirty. Create something your own.',copy:'Meet local potters and learn how they turn earth into beautiful pots and everyday objects. Try shaping clay on the wheel yourself: from wet clay in your hands to making your own piece, connect with local craft and generations of skill.',where:'Nilambur and selected pottery villages in Malabar',duration:'2–3 hours'},
{title:'Bamboo Art Workshop',slug:'bamboo',tagline:'The art of turning bamboo into beauty',copy:'Explore traditional bamboo weaving in Wayanad’s bamboo villages. Meet artisans, learn how they make baskets, lamps and everyday objects, and try making something with your own hands. Discover skills passed through generations and take home a handmade memento.',where:'Wayanad bamboo villages',duration:'2–3 hours'}
];
const experienceImages: Record<string, string> = {
  food: '/images/malabar-food.jpg',
  kaalappoottu: '/images/kaalappoottu.jpg',
  theyyam: '/images/theyyam.jpg',
  'sevens-football-malabar': '/images/sevens-football.jpg',
  'mappila-malabar-arts': '/images/malabar-arts.jpg',
  henna: '/images/henna.jpg',
  pottery: '/images/pottery.jpg',
  bamboo: '/images/bamboo.jpg',
};
const experienceImage = (experience: Experience) =>
  experienceImages[experience.slug] ?? '/images/malabar-arts.jpg';
const artSlugs=['oppana','arabana-muttu','kolkali','paricha-muttu','vattappattu','muttippattu','cheeni-muttu-and-kuthu-ratib','thira','poorakkali'];
const artTitles=['Oppana','Arabana Muttu','Kolkali','Paricha Muttu','Vattappattu','Muttippattu','Cheeni Muttu and Kuthu Ratib','Thira','Poorakkali'];
const artCopy=[
'The Mappila bridal song and dance. Women sing and clap in a circle around the seated bride, with the song and steps in two styles, Chayal and Murukkam. Hear Mappilappattu from the people who grew up with it.',
'A dance of the arabana, a small single-sided flat hand drum, played to welcome guests and honour heroes. The drummers sway, toss the drums overhead and catch them, all in step. Its cousin, Duff Muttu, uses the larger round duff.',
'Dancers move in shifting circles, striking decorated sticks together in rising rhythm. The Mappila version opens with prayer and carries Islamic songs, rooted in the stepwork of Kalarippayattu.',
'A martial art turned performance. Twelve men with shields (paricha) and swords clash in rhythm to steps from Kalarippayattu, led by the master in the centre and opened with prayers and Arabi-Malayalam songs.',
'A circle of singers around the bride on a wedding night. Groups of men and women answer each other, song for song, with handclaps and a brass spittoon beaten with an areca leaf fan.',
'The clap-led song tradition of Mappila gatherings, closely tied to the Kaimuttippattu singing of weddings. Voices and handclaps carry the rhythm, with no need for instruments.',
'Two devotional traditions, introduced with care. Cheeni Muttu is festival music of the cheeni, a shahnai brought from Persia. Kuthu Ratib is a Sufi ritual of Arabic litanies and arabana drumming; guests visit only by invitation, to listen and learn.',
'A ritual dance-drama of South Malabar sacred groves. Performers wear coconut-leaf skirts, brass headgear and painted faces, carrying a deity through a night of drumming and song.',
'A dance of North Malabar Bhagavathy temples, in which men circle a lamp in rhythm, using steps drawn from Kalarippayattu. Performed in Meenam, around March and April.'
];
const artWhere=['Calicut, Malappuram, Kannur','Kannur, Kasaragod, Calicut','Kannur, Calicut, Malappuram','Calicut, Malappuram','Malappuram, Calicut','Malappuram, Calicut, Kannur','Malappuram (Kondotty), Calicut, Kannur','Calicut, Malappuram, Wayanad, Kannur','Kannur, Kasaragod'];
const allDestinations = [...south,...kerala,...malabar];
const findDestination=(slug:string)=>allDestinations.find(d=>slugify(d.name)===slug);
const Video = ({id,title}:{id?:string;title:string}) => <div className="video-frame">{id?<iframe loading="lazy" title={`${title} film`} src={`https://www.youtube-nocookie.com/embed/${id}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>:<div className="video-placeholder"><span className="eyebrow">A closer look</span><strong className="serif">{title}</strong></div>}</div>;
function Metadata({title,description}:{title:string;description:string}){useEffect(()=>{document.title=title;const set=(key:string,val:string,property=false)=>{let el=document.querySelector(`meta[${property?'property':'name'}="${key}"]`) as HTMLMetaElement|null;if(!el){el=document.createElement('meta');el.setAttribute(property?'property':'name',key);document.head.appendChild(el)}el.content=val};set('description',description);set('og:title',title,true);set('og:description',description,true);set('og:type','website',true);set('og:image',logo,true);set('twitter:title',title);set('twitter:description',description);set('twitter:image',logo);},[title,description]);return null}
function Shell({children}:{children:React.ReactNode}){
  const [open,setOpen]=useState(false);
  const [location]=useLocation();
  const nav=[['Journeys','/en/south-indian-tours'],['Kerala','/en/kerala-tours'],['Malabar Signatures','/en/malabar-signatures'],['Experiences','/en/experiences'],['Our story','/en/about']];
  return <><div className="topline">Journeys shaped by the people who call this place home</div><header className="nav"><div className="wrap navinner"><Link href="/" className="brand" aria-label="Malabar Ways home"><img src={logo} alt="Malabar Ways"/></Link><nav className="navlinks" aria-label="Main navigation">{nav.map(([t,p])=><Link key={p} href={p} style={location.startsWith(p)?{color:'#ad8a31',fontWeight:700}:{}}>{t}</Link>)}</nav><a className="navcta" href={wa('a journey in South India')} target="_blank" rel="noreferrer">Plan a journey <ArrowRight size={14}/></a><button className="menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>{open&&<nav className="mobile-panel" aria-label="Mobile navigation">{nav.map(([t,p])=><Link key={p} href={p} onClick={()=>setOpen(false)}>{t}</Link>)}<a href={wa('a journey')} target="_blank" rel="noreferrer">Plan a journey</a></nav>}</div></header>{children}<Footer/><a className="floating-enquiry" href={wa('a journey with Malabar Ways')} target="_blank" rel="noreferrer" aria-label="Enquire on WhatsApp"><span className="online-pulse"></span><MessageCircle size={16}/> Enquire</a></>}
function Footer(){return <footer className="footer"><div className="wrap"><div className="footer-grid"><div><img className="footer-logo" src={logo} alt="Malabar Ways"/><p>Journeys into the people, food, craft, landscape and living traditions of South India. Rooted in Malabar.</p></div><div><h4>Find your way</h4><div className="footer-links"><Link href="/en/south-indian-tours">South India tours</Link><Link href="/en/kerala-tours">Kerala tours</Link><Link href="/en/malabar-signatures">Malabar Signatures</Link><Link href="/en/experiences">Experiences</Link><Link href="/en/about">About Malabar Ways</Link></div></div><div><h4>Talk to us</h4><p><a href="tel:+919496885372">+91 9496885372</a><br/>X-169, Kottachalil House, School Road Kuzhinholam, Kizhisseri, Thavanoor (P.O), Malappuram, Kerala, India</p><a href={wa('a custom journey')} target="_blank" rel="noreferrer">Start a conversation <ArrowUpRight size={13}/></a></div></div><div className="footer-bottom"><span>© Malabarways Private Limited</span><span>South India, told through its people.</span></div></div></footer>}
function CTA({context}:{context:string}){return <section className="contact-band"><div className="wrap contact-inner"><h2>Some journeys begin with a question.</h2><a className="button" href={wa(context)} target="_blank" rel="noreferrer">Enquire about {context} <ArrowRight size={15}/></a></div></section>}
function VideoSection({id,title}:{id?:string;title:string}){return <section className="section compact"><div className="wrap experience-detail-grid"><div><span className="eyebrow">See the place in motion</span><h2 className="display" style={{fontSize:'clamp(34px,4vw,54px)',marginTop:16}}>A first glimpse.<br/><i>Not the whole story.</i></h2><p className="section-intro">Let the landscapes, rhythms and everyday moments of {title} bring the journey into focus.</p></div><Video id={id} title={title}/></div></section>}

function JourneyCurator(){
  const [region, setRegion] = useState('Malabar Signatures (North Kerala)');
  const [duration, setDuration] = useState('4 to 6 days');
  const [focus, setFocus] = useState('Living Arts & Food Trails');
  const query = `a customized journey to ${region} for ${duration} focusing on ${focus}`;

  return <section className="curator-section">
    <div className="wrap">
      <div className="curator-card">
        <div className="curator-header">
          <span className="eyebrow"><Sparkles size={11} style={{display:'inline',marginRight:4}}/> Curate Your Route</span>
          <h3>Where does your curiosity lead?</h3>
          <p>Choose your preferences and our local hosts will shape a private itinerary around you.</p>
        </div>
        <div className="curator-grid">
          <div className="curator-field">
            <label><Compass size={12}/> Region</label>
            <select value={region} onChange={e=>setRegion(e.target.value)}>
              <option value="Malabar Signatures (North Kerala)">Malabar Signatures (North Kerala)</option>
              <option value="Classic Kerala & Backwaters">Classic Kerala & Backwaters</option>
              <option value="Western Ghats & Coffee Country">Western Ghats & Coffee Country</option>
              <option value="Grand South India Expedition">Grand South India Expedition</option>
            </select>
          </div>
          <div className="curator-field">
            <label><Clock3 size={12}/> Duration</label>
            <select value={duration} onChange={e=>setDuration(e.target.value)}>
              <option value="2 to 3 days (Short Escape)">2 to 3 days (Short Escape)</option>
              <option value="4 to 6 days (Immersive)">4 to 6 days (Immersive)</option>
              <option value="7 to 10 days (Complete Circuit)">7 to 10 days (Complete Circuit)</option>
              <option value="12+ days (Grand Expedition)">12+ days (Grand Expedition)</option>
            </select>
          </div>
          <div className="curator-field">
            <label><Star size={12}/> Experience Focus</label>
            <select value={focus} onChange={e=>setFocus(e.target.value)}>
              <option value="Living Arts & Rituals (Theyyam, Mappila)">Living Arts & Rituals (Theyyam, Mappila)</option>
              <option value="Culinary & Spices (Malabar Biriyani, Farms)">Culinary & Spices (Biriyani, Farms)</option>
              <option value="Quiet Waters & Seaside Stays">Quiet Waters & Seaside Stays</option>
              <option value="Temples, Forts & Ancient Ports">Temples, Forts & Ancient Ports</option>
            </select>
          </div>
          <div className="curator-btn-wrap">
            <a className="button curator-btn" href={wa(query)} target="_blank" rel="noreferrer">
              Plan on WhatsApp <ArrowRight size={14}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

function TravelerStories(){
  const stories=[
    {
      q:"Sitting in an ancestral home in Thalassery eating hot dum biriyani with three generations of cooks—this was not sightseeing, it was true connection.",
      a:"Priya & Sean",
      loc:"Bengaluru & Melbourne",
      tag:"Malabar Culinary Journey"
    },
    {
      q:"Witnessing Theyyam in a village shrine at 2 AM was transcendent. Our host briefed us with so much reverence, care and respect for the local community.",
      a:"Marcus & Elena",
      loc:"Zurich, Switzerland",
      tag:"Living Rituals Trail"
    },
    {
      q:"Drifting through the quiet canals on a private wooden kettuvallam with fresh pearl spot fish cooked right in front of us. Unhurried, poetic South India.",
      a:"Aditi & Rahul",
      loc:"Mumbai",
      tag:"Backwaters & Coast"
    }
  ];
  return <section className="section stories-section">
    <div className="wrap">
      <div className="section-head">
        <div>
          <span className="eyebrow">Real Encounters</span>
          <h2 className="display">Moments that stay with you.</h2>
        </div>
        <p className="section-intro">Notes from travellers who stepped past the postcards into the true rhythm of South India.</p>
      </div>
      <div className="stories-grid">
        {stories.map(s=><div className="story-card" key={s.a}>
          <div className="story-stars">★★★★★</div>
          <p className="story-q">“{s.q}”</p>
          <div className="story-meta">
            <strong>{s.a}</strong>
            <span>{s.loc} · <em>{s.tag}</em></span>
          </div>
        </div>)}
      </div>
    </div>
  </section>;
}

function Home(){
  return <>
    <Metadata title="Malabar Ways | Journeys into the living South" description="Travel South India through the people, food, craft, landscape and living traditions of Kerala and Malabar with Malabar Ways."/>
    <section className="hero">
      <div className="wrap hero-content">
        <span className="eyebrow">South India, closer than you imagined</span>
        <h1 className="display">Come for the<br/><i>land.</i> Stay for its stories.</h1>
        <p>From a family kitchen in Malabar to the still waters of Kerala. Journeys made with the people who call this place home.</p>
        <div className="hero-actions">
          <Link className="button" href="/en/malabar-signatures">Explore Malabar <ArrowRight size={15}/></Link>
          <Link className="button outline" href="/en/kerala-tours">Find your Kerala</Link>
          <a className="button gold" href={wa('a custom South India journey')} target="_blank" rel="noreferrer"><MessageCircle size={15}/> Plan on WhatsApp</a>
        </div>
      </div>
      <div className="hero-stats-bar">
        <div className="wrap hero-stats-grid">
          <div className="stat-item"><span className="stat-num">10+</span><span className="stat-lbl">Malabar Signatures</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-num">100%</span><span className="stat-lbl">Private & Host-Led</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-num">4.9★</span><span className="stat-lbl">Guest Experience</span></div>
          <div className="stat-divider"></div>
          <div className="stat-item"><span className="stat-num">Direct</span><span className="stat-lbl">Community Benefit</span></div>
        </div>
      </div>
    </section>

    <JourneyCurator/>

    <section className="section">
      <div className="wrap intro-grid">
        <div>
          <span className="eyebrow">A different way through</span>
          <h2 className="display">More than a place<br/>to pass through.</h2>
        </div>
        <div>
          <p className="intro-copy">Malabar Ways is where a journey begins with a scent. Fresh cardamom in a home kitchen. Wet clay on a potter’s wheel. Cotton threads on a handloom. We bring travellers close to the people, craft and traditions that keep South India alive.</p>
          <p className="intro-note">“You will not just visit Malabar, Kerala or South India. You will live its stories.”</p>
        </div>
      </div>
    </section>

    <section className="section compact">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Choose the feeling</span>
            <h2 className="display">Where will the story take you?</h2>
          </div>
          <p className="section-intro">Pick one place, or let us connect the coast, hills, heritage and table into a journey that feels like yours.</p>
        </div>
        <div className="destination-grid">
          {[{n:'South India',p:'/en/south-indian-tours',d:'Many worlds, one thoughtful journey.',badge:'11 DESTINATIONS'},{n:'Kerala',p:'/en/kerala-tours',d:'Backwaters, tea country and old ports.',badge:'8 DESTINATIONS'},{n:'Malabar Signatures',p:'/en/malabar-signatures',d:'The north Kerala few have seen.',badge:'10 SIGNATURES'}].map((x,i)=><Link href={x.p} className="destination-card" key={x.n}>
            <span className="card-badge">{x.badge}</span>
            <span className="card-no">0{i+1} / JOURNEYS</span>
            <div>
              <h3>{x.n}</h3>
              <p>{x.d}</p>
            </div>
            <span className="arrow"><ArrowUpRight/></span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="section dark-band">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">The Malabar Ways difference</span>
            <h2 className="display">Travel with a little more<br/><i>meaning.</i></h2>
          </div>
          <p className="section-intro">We work with local hosts, families, artists and artisans. The result is a journey that gives back to the places that make it unforgettable.</p>
        </div>
        <div className="reason-grid">
          {[['Local knowledge','We live here. We know the kitchens, craft workshops and quiet corners.'],['Human encounters','Meet the people who carry the traditions, not just the landmarks.'],['Thoughtful arrivals','Airport and station pickups, private transfers and a clear road ahead.'],['A fair exchange','Your visit supports the hosts, artists and communities you meet.'],['Your own pace','A single experience or a fully custom route. We shape it together.']].map(([t,p])=><div className="reason" key={t}><strong>{t}</strong><p>{p}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Meet the living traditions</span>
            <h2 className="display">Not behind glass.<br/>Part of everyday life.</h2>
          </div>
          <Link href="/en/experiences" className="button outline">All experiences <ArrowRight size={14}/></Link>
        </div>
        <div className="experiences-grid">
          {experiences.slice(0,4).map((e,i)=><Link href={`/en/experiences/${e.slug}`} className="experience-tile" key={e.slug}>
            <span>Experience 0{i+1}</span>
            <div>
              <h3>{e.title}</h3>
              <p>{e.tagline}</p>
            </div>
            <div className="tile-link">Discover <ArrowUpRight size={15}/></div>
          </Link>)}
        </div>
      </div>
    </section>

    <TravelerStories/>

    <section className="quote-band">
      <div className="wrap">
        <p>“A place is never only its scenery. It is the hands that cook, make, welcome and remember.”</p>
      </div>
    </section>

    <CTA context="a South India journey"/>
    <VideoSection id="3WvLkuteM3M" title="Malabar"/>
  </>;
}
function DestinationCard({d,index,prefix}:{d:Destination;index:number;prefix:string}){return <Link href={`${prefix}/${slugify(d.name)}`} className="destination-card" data-testid={`card-destination-${slugify(d.name)}`}><img className="card-photo" src={destinationImage(d)} alt="" aria-hidden="true" loading="lazy" onError={(event)=>{event.currentTarget.style.display='none'}}/><span className="card-no">{String(index+1).padStart(2,'0')} / DESTINATION</span><div><h3>{d.name}</h3><p>{d.tagline}</p></div><span className="arrow"><ArrowUpRight/></span></Link>}
function JourneyList({items,prefix}:{items:Destination[];prefix:string}){return <div className="journey-list">{items.map((d,i)=><article className="journey" key={d.name}><div className="journey-number">{String(i+1).padStart(2,'0')}</div><div><h3>{d.name}</h3><span className="duration">{d.duration}</span></div><p>{d.intro}</p><Link className="arrow" aria-label={`Explore ${d.name}`} href={`${prefix}/${slugify(d.name)}`}><ArrowUpRight/></Link><details><summary>Journey details</summary><div className="itinerary">{d.itinerary.map((item,n)=><article key={n}><h4>{item.split(' · ')[0]}</h4><p>{item.includes(' · ')?item.split(' · ').slice(1).join(' · '):item}</p></article>)}</div></details></article>)}</div>}
function Collection({kind}:{kind:'south'|'kerala'|'malabar'}){const cfg={south:{title:'Pick Your South India.',intro:'Ancient temples, coffee hills, quiet beaches and biriyani lanes. Choose the place that calls you, and we will take care of the rest.',copy:'South India is not one place. It is many worlds, each with its own language, food and rhythm. Choose a destination, and we shape your trip around real people, real kitchens and real traditions. Add a neighbour whenever you like.',desc:'South India tour packages across heritage, food, hill country and coast.',items:south,video:'nOARyo6dOLc',path:'/en/south-indian-tours',eyebrow:'Many worlds. One thoughtful route.'},kerala:{title:'Kerala, Beyond the Postcard.',intro:'Drift through backwaters, climb into tea clouds, walk where ancient ships once docked, and eat at tables that have fed the world for centuries.',copy:'Kerala’s green coast drew Arab, Roman, Chinese and European traders long before holidaymakers. Every one left a mark on its mosques, churches, temples, food and faces. Choose a destination and we turn it into a journey with real people, kitchens and stories.',desc:'Kerala tours from backwaters and hills to heritage and Malabar.',items:kerala,video:'MC9gTqOeGSw',path:'/en/kerala-tours',eyebrow:'Water, spice, story.'},malabar:{title:'Malabar. The Kerala Few Have Seen.',intro:'Fire-lit Theyyam nights, biriyani from family kitchens, empty beaches and misty hills. This is our signature, and it is ours alone.',copy:'Most visitors meet Kerala’s south and middle. Malabar waits quietly beyond: wild coast, red-laterite forts, forested hills and backwaters few travellers reach. This is where Kerala’s oldest trade stories began, where faiths share a village and arts like Theyyam, Oppana and Kolkkali live as part of ordinary life.',desc:'Malabar journeys through North Kerala’s food, living culture, coast and hills.',items:malabar,video:'3WvLkuteM3M',path:'/en/malabar-signatures',eyebrow:'Rooted in the north. Open to the world.'}}[kind];const prefix=cfg.path;const destinations=(<section className="section" id="destinations"><div className="wrap"><div className="section-head"><div><span className="eyebrow">Choose your destination</span><h2 className="display">{kind==='malabar'?'Ten destinations. Countless stories.':'Start with the place that calls.'}</h2></div><p className="section-intro">{kind==='malabar'?'Combine coastal towns, historic mosques, craft, Theyyam, paddy fields and mountain escapes.':'Each stay length is a guide. Combine nearby places and customise the itinerary.'}</p></div><div className="destination-grid">{cfg.items.map((d,i)=><DestinationCard key={d.name} d={d} index={i} prefix={prefix}/>)}</div></div></section>);return <><Metadata title={`${cfg.title} | Malabar Ways`} description={cfg.desc}/><section className="page-hero"><div className="wrap"><div className="breadcrumb">Malabar Ways / Journeys</div><span className="eyebrow">{cfg.eyebrow}</span><h1 className="display">{cfg.title}</h1><p>{cfg.intro}</p><div className="hero-actions" style={{marginTop:26}}><a className="button" href="#destinations">Choose a destination <ArrowRight size={14}/></a><a className="button outline" href={wa(kind==='south'?'a custom South India trip':kind==='kerala'?'a custom Kerala trip':'a Malabar Signatures journey')} target="_blank" rel="noreferrer">Plan a custom trip</a></div></div></section>{destinations}<section className="section"><div className="wrap intro-grid"><div><span className="eyebrow">A region in many layers</span><h2 className="display">This is not a route<br/>from a catalogue.</h2></div><div><p className="intro-copy">{cfg.copy}</p><p className="intro-note">{kind==='malabar'?'Food trails, living arts and landscapes few visitors find.':'Choose the place. We will shape everything around it.'}</p></div></div></section><section className="section dark-band"><div className="wrap"><div className="section-head"><div><span className="eyebrow">Why this place feels different</span><h2 className="display">{kind==='south'?'An entire world, close at hand.':kind==='kerala'?'A coast shaped by the world.':'The north side, at its own pace.'}</h2></div><p className="section-intro">{kind==='malabar'?'Food, arts, open coast and living heritage in the hands of local hosts.':'A rare closeness of cultures, landscapes and traditions.'}</p></div><div className="reason-grid">{(kind==='south'?[['Temples as towns','Carved stone and ritual rhythms that continue today.'],['Art still alive','Dance, music and ritual theatre are part of daily life.'],['A different table','Rice, coconut, dosa, filter coffee and biriyani.'],['Many faiths, one street','Mosques, churches and temples share the landscape.'],['Landscapes close by','Beaches, rainforest, tea hills and ancient ruins.']]:kind==='kerala'?[['Water everywhere','Backwaters, lakes, rivers and a long warm coast.'],['Spice that shaped history','Pepper and cardamom once drew the world’s ships.'],['Many faiths, one welcome','Ancient mosques, synagogues, churches and temples.'],['Art you can feel','Kathakali, Theyyam and festivals live here.'],['A feast on a leaf','Sadya, fish curry, appam, biriyani and coconut.']]:[['Food trails','Biriyani, Calicut halwa, snacks and home cooking.'],['Art you can watch','Oppana, Theyyam, Kolkkali and Mappila songs.'],['Nature in every direction','Beaches, hills, rainforest, rivers and backwaters.'],['Heritage you can touch','Mosques, temples, forts, handloom and pottery.'],['Small and responsible','Local hosts and fair work for communities.']]).map(([t,p])=><div className="reason" key={t}><strong>{t}</strong><p>{p}</p></div>)}</div></div></section><section className="section compact"><div className="wrap"><div className="section-head"><div><span className="eyebrow">The shape of the journey</span><h2 className="display">Every detail, considered.</h2></div><p className="section-intro">{kind==='south'?'Easy arrivals. Private transfers. Local hosts, kitchens and craftspeople.':kind==='kerala'?'Two to three days per destination is a lovely pace; a full Kerala journey takes 7 to 10 days.':'One day or a full week. Choose a destination and we plan the road between.'}</p></div><JourneyList items={cfg.items} prefix={prefix}/></div></section><section className="section compact"><div className="wrap"><div className="section-head"><div><span className="eyebrow">A few helpful notes</span><h2 className="display">Good to know.</h2></div></div><div className="faq">{(kind==='south'?[['When should I come?','October to March for most places. For Goa, November to February.'],['Do I need to plan everything?','No. Choose a destination and we shape the rest.'],['Can I combine destinations?','Yes. We plan the road between places and can continue into Kerala and Malabar.']]:kind==='kerala'?[['When is the best time to visit Kerala?','September to March for most places. The monsoon from June to August is the season for Ayurveda and green landscapes.'],['How long should I allow?','Two to three days per destination; a full Kerala journey takes 7 to 10 days.'],['Can I combine destinations?','Yes. Choose a pace and we will plan every road.']]:[['When should I visit Malabar?','October to March for most of the region. Theyyam is mostly seen from late autumn to spring.'],['Can I book one destination?','Yes. Combine several and we will plan the road between them.'],['What makes Malabar different?','It is quieter, rooted in local life, and still unexplored by most visitors.']]).map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section><CTA context={kind==='south'?'a South India trip':kind==='kerala'?'a Kerala package':'a Malabar journey'}/><VideoSection id={cfg.video} title={kind==='south'?'South India':kind==='kerala'?'Kerala':'Malabar'}/></>}
function DestinationDetail({d,category}:{d:Destination;category:string}){
  const cat=category==='south'?'South India':category==='kerala'?'Kerala':'Malabar';
  return <>
    <Metadata title={`${d.name} Tour | ${d.tagline} | Malabar Ways`} description={`${d.intro} Explore ${d.name} with Malabar Ways: ${d.duration}, local hosts and thoughtful private journeys.`}/>
    <div className="detail-hero">
      <div className="detail-hero-copy">
        <div className="breadcrumb"><Link href={category==='south'?'/en/south-indian-tours':category==='kerala'?'/en/kerala-tours':'/en/malabar-signatures'}>{cat} / Destinations</Link></div>
        <span className="eyebrow">A journey in {cat}</span>
        <h1 className="display">{d.name}</h1>
        <p>{d.tagline}. {d.intro}</p>
        <div className="detail-meta">
          <span><Clock3 size={14}/> {d.duration}</span>
          {d.airport&&<span><Plane size={14}/> Airport access</span>}
          {d.rail&&<span><TrainFront size={14}/> Rail access</span>}
        </div>
        <a className="button" href={wa(`${d.name} tour`)} target="_blank" rel="noreferrer">Ask about {d.name} <ArrowRight size={14}/></a>
      </div>
      <div className="detail-art" role="img" aria-label={`${d.name} landscape`} style={{backgroundImage:`linear-gradient(0deg,rgba(22,75,60,.08),rgba(22,75,60,.08)),url('${destinationImage(d)}')`}}/>
    </div>
    <section className="section">
      <div className="wrap detail-content">
        <div>
          <span className="eyebrow">The feeling of the place</span>
          <h2>{d.tagline}</h2>
          <p>{d.intro}</p>
          {d.highlights&&<><h2 style={{marginTop:40}}>What stays with you</h2><ul className="feature-list">{d.highlights.map(t=><li key={t}>{t}</li>)}</ul></>}
        </div>
        <aside className="fact-box">
          <h3>Getting there</h3>
          {d.airport&&<p><strong>By air</strong><br/>{d.airport}</p>}
          {d.rail&&<p><strong>By rail</strong><br/>{d.rail}</p>}
          {d.transport&&<p><strong>Local transport</strong><br/>{d.transport}</p>}
          <p><strong>Suggested stay</strong><br/>{d.duration}</p>
          {d.season&&<p><strong>Season</strong><br/>{d.season}</p>}
        </aside>
      </div>
    </section>
    
    <section className="section compact">
      <div className="wrap">
        <div className="section-head">
          <div><span className="eyebrow">A considered itinerary</span><h2 className="display">Your days in {d.name}.</h2></div>
          <p className="section-intro">A starting point, not a fixed schedule. We can shape the pace around you.</p>
        </div>
        <div className="itinerary">{d.itinerary.map((it,i)=><article key={it}><h4>{it.split(' · ')[0]}</h4><p>{it.includes(' · ')?it.split(' · ').slice(1).join(' · '):it}</p></article>)}</div>
      </div>
    </section>
    <CTA context={`${d.name} tour`}/>{d.video&&<VideoSection id={d.video} title={d.name}/>}
  </>;
}
function ExperienceIndex(){return <><Metadata title="Malabar Cultural Experiences | Food, Theyyam, Craft | Malabar Ways" description="Live Malabar through its food, ritual arts, football, henna, pottery, bamboo craft and village traditions with local hosts."/><section className="page-hero"><div className="wrap"><div className="breadcrumb">Malabar Ways / Experiences</div><span className="eyebrow">Come curious. Leave connected.</span><h1 className="display">Don’t visit Malabar.<br/><i>Live it.</i></h1><p>Cook in a family kitchen. Feel the rhythm of a village ground. Watch ritual arts where they belong. These are not shows. They are Malabar life, and you are invited in.</p><div className="hero-actions" style={{marginTop:26}}><a className="button" href="#experience-list">Choose an experience <ArrowRight size={14}/></a><a className="button outline" href={wa('a custom Malabar experience')} target="_blank" rel="noreferrer">Design my own</a></div></div></section><section className="section compact" id="experience-list"><div className="wrap"><div className="section-head"><div><span className="eyebrow">Choose your experience</span><h2 className="display">A door into a different story.</h2></div><p className="section-intro">Some traditions follow the season. We will help you find the right moment, and meet each community with care.</p></div><div className="experiences-grid">{experiences.map((e,i)=><Link href={`/en/experiences/${e.slug}`} className="experience-tile" key={e.slug}><span>Experience {String(i+1).padStart(2,'0')}</span><div><h3>{e.title}</h3><p>{e.tagline}</p></div><div className="tile-link">Discover <ArrowUpRight size={15}/></div></Link>)}</div></div></section><section className="section"><div className="wrap intro-grid"><div><span className="eyebrow">People, not performances</span><h2 className="display">Tradition lives<br/>in the everyday.</h2></div><div><p className="intro-copy">Most travel puts culture behind glass. Malabar does the opposite. Tradition lives in kitchens, courtyards, paddy fields, football grounds, village temples and heritage mosques, handed down by people who still practise it every day.</p><p className="intro-copy">Each experience is built with local families, artists and artisans. Choose one, or stack several into your own journey.</p></div></div></section><section className="section dark-band"><div className="wrap"><div className="section-head"><div><span className="eyebrow">Why travel with us</span><h2 className="display">Care is part of<br/>the experience.</h2></div></div><div className="reason-grid">{[['People, not performers','Meet the families and artists who live each tradition.'],['Small and personal','Room to ask, taste, try and talk.'],['Respect built in','We brief guests so sacred and community moments stay respected.'],['A fair exchange','Your fee goes to the hosts, artists and artisans you meet.'],['Easy to join','We arrange pickups, transfers, stays and guides.']].map(([t,p])=><div className="reason" key={t}><strong>{t}</strong><p>{p}</p></div>)}</div></div></section><section className="section compact"><div className="wrap"><span className="eyebrow">Questions answered</span><h2 className="display" style={{marginBottom:30}}>Before you join in.</h2><div className="faq">{[['Can I book just one experience?','Yes. You can also combine several into a longer Malabar journey.'],['Are performances always available?','Some experiences, including Theyyam, Kaalappoottu and Sevens football, depend on the season and local calendars. We plan around them.'],['Are the experiences suitable for children?','Most are. We can advise on each when you enquire.'],['How do you make cultural visits respectful?','We arrange experiences with the consent of hosts and artists, provide etiquette guidance, and ensure fees reach the communities.']].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section><CTA context="a Malabar experience"/></>}
function ExperienceDetail({experience:e}:{experience:Experience}){
  const isArts=e.slug==='mappila-malabar-arts';
  return <>
    <Metadata title={`${e.title} | Malabar Cultural Experiences | Malabar Ways`} description={`${e.tagline}. ${e.copy.slice(0,120)}... Enquire with Malabar Ways.`}/>
    <div className="detail-hero">
      <div className="detail-hero-copy">
        <div className="breadcrumb"><Link href="/en/experiences">Experiences</Link> / Malabar</div>
        <span className="eyebrow">A Malabar Ways experience</span>
        <h1 className="display">{e.title}</h1>
        <p>{e.tagline}. {e.copy}</p>
        <div className="detail-meta"><span><MapPin size={14}/> {e.where}</span><span><Clock3 size={14}/> {e.duration}</span></div>
        <a className="button" href={wa(e.title)} target="_blank" rel="noreferrer">Enquire about this <ArrowRight size={14}/></a>
      </div>
      <div className="detail-art" role="img" aria-label={`${e.title} experience`} style={{backgroundImage:`linear-gradient(0deg,rgba(22,75,60,.08),rgba(22,75,60,.08)),url('${experienceImage(e)}')`}}/>
    </div>
    
    <section className="section">
      <div className="wrap experience-detail-grid">
        <div>
          <span className="eyebrow">{isArts?'Nine arts, many ways in':'A closer encounter'}</span>
          <h2 className="display">{isArts?'Made for weddings, welcomes and sacred days.':'A story you can step into.'}</h2>
          <p className="section-intro">{e.copy}</p>
          {e.season&&<p className="intro-note">{e.season}</p>}
        </div>
        <aside className="fact-box">
          <h3>Experience details</h3>
          <p><strong>Where</strong><br/>{e.where}</p>
          <p><strong>Duration</strong><br/>{e.duration}</p>
          {e.season&&<p><strong>Season</strong><br/>{e.season}</p>}
          <a className="button" style={{width:'100%',marginTop:20}} href={wa(e.title)} target="_blank" rel="noreferrer">Ask about dates <ArrowRight size={14}/></a>
        </aside>
      </div>
    </section>
    {isArts?
      <section className="section compact">
        <div className="wrap">
          <div className="section-head">
            <div><span className="eyebrow">Explore the art forms</span><h2 className="display">Each one has its own rhythm.</h2></div>
            <p className="section-intro">Curated sessions can be arranged for your dates. Live events follow the community calendar, by invitation and with respect.</p>
          </div>
          <div className="journey-list">{artTitles.map((t,i)=><article className="journey" key={t}><div className="journey-number">{String(i+1).padStart(2,'0')}</div><div><h3>{t}</h3><span className="duration">{artWhere[i]}</span></div><p>{artCopy[i]}</p><Link className="arrow" href={`/en/experiences/mappila-malabar-arts/${artSlugs[i]}`} aria-label={`Read about ${t}`}><ArrowUpRight/></Link></article>)}</div>
          <div className="faq" style={{marginTop:50}}>{[['Is this a staged show?','No. Curated sessions are arranged with real artists and troupes; live events are real community occasions.'],['Can I join in?','Often in songs, steps and drumming. For sacred rituals such as Thira and Kuthu Ratib, guests watch and listen as the community advises.'],['Can I take photographs?','Usually with permission. For ritual nights we explain what is allowed; some moments are never photographed.'],['When is best?','Curated sessions run all year. Thira and Poorakkali are seasonal; weddings and festivals follow local calendars.']].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        </div>
      </section>
      :
      <section className="section compact">
        <div className="wrap"><span className="eyebrow">What you’ll experience</span><h2 className="display" style={{marginBottom:20}}>A little closer to the place.</h2><ul className="feature-list">{(e.points||[]).map(p=><li key={p}>{p}</li>)}</ul></div>
      </section>}
    <CTA context={e.title}/>{e.video&&<VideoSection id={e.video} title={e.title}/>}
  </>;
}
function ArtDetail({slug}:{slug:string}){const i=artSlugs.indexOf(slug);if(i<0)return <NotFound/>;const e:Experience={title:artTitles[i],slug,tagline:'Meet Malabar’s arts where they live',copy:artCopy[i],where:artWhere[i],duration:(i===7||i===8)?'Seasonal · Dates follow local calendars':'Curated sessions or invited live events',season:(i===7||i===8)?'Seasonal; ask us about dates.':undefined};return <ExperienceDetail experience={e}/>}
function About(){return <><Metadata title="About Malabar Ways | Rooted in Malabar" description="Meet Malabarways Private Limited, a travel company rooted in Malabar and creating people-first journeys through South India."/><section className="page-hero"><div className="wrap"><div className="breadcrumb">Malabar Ways / Our story</div><span className="eyebrow">Rooted here. Open to the world.</span><h1 className="display">The journey begins<br/>with a scent.</h1><p>Fresh cardamom in a home kitchen. Wet clay on a potter’s wheel. Jasmine and incense at a temple door. The soft smell of attar drifting from an old mosque.</p></div></section><section className="section"><div className="wrap intro-grid"><div><span className="eyebrow">About Malabar Ways</span><h2 className="display">Travel through<br/>real life.</h2></div><div><p className="intro-copy">Malabar Ways is a leading travel company for South Indian tours, with our heart in Malabar. Our Kerala packages and signature Malabar journeys are built around real people, not just places.</p><p className="intro-copy">Meet the weavers, potters, cooks, artists and storytellers who keep this land alive. Sit in a mosque courtyard at dusk, walk to a temple through coconut groves, taste biriyani from a family kitchen, and watch a ritual art form come to life.</p><p className="intro-copy">Every journey is responsible tourism, so your visit supports the communities and traditions you came to see. Choose a luxury escape or a custom trip. You will not just visit Malabar, Kerala or South India. You will live its stories.</p></div></div></section><section className="section dark-band"><div className="wrap"><div className="section-head"><div><span className="eyebrow">A considered way to travel</span><h2 className="display">A visit that leaves<br/>something good behind.</h2></div><p className="section-intro">Our journeys are shaped with local families and artists. Your time, attention and contribution help support the traditions you came to experience.</p></div></div></section><section className="section"><div className="wrap intro-grid"><div><span className="eyebrow">Talk with us</span><h2 className="display">Let’s begin<br/>with a place.</h2></div><div className="fact-box"><h3>Malabarways Private Limited</h3><p><strong>Phone & WhatsApp</strong><br/><a href="tel:+919496885372">+91 9496885372</a></p><p><strong>Address</strong><br/>X-169, Kottachalil House, School Road Kuzhinholam, Kizhisseri, Thavanoor (P.O), Malappuram, Kerala, India</p><a className="button" style={{width:'100%',marginTop:20}} href={wa('a custom journey')} target="_blank" rel="noreferrer">Start an enquiry <ArrowRight size={14}/></a></div></div></section><CTA context="a custom South India journey"/></>}
function Router(){const [location]=useLocation();const [,southDetail]=useRoute('/en/south-indian-tours/:slug');const [,keralaDetail]=useRoute('/en/kerala-tours/:slug');const [,malabarDetail]=useRoute('/en/malabar-signatures/:slug');const [,experienceDetail]=useRoute('/en/experiences/:slug');const [,artDetail]=useRoute('/en/experiences/mappila-malabar-arts/:slug');const slug=(southDetail||keralaDetail||malabarDetail||experienceDetail||artDetail)?.slug;const d=(southDetail||keralaDetail||malabarDetail)&&slug?findDestination(slug):undefined;const exp=(experienceDetail&&slug)?experiences.find(e=>e.slug===slug):undefined;return <ErrorBoundary resetKey={location}><Shell><Switch><Route path="/" component={Home}/><Route path="/en/south-indian-tours" component={()=> <Collection kind="south"/>}/><Route path="/en/kerala-tours" component={()=> <Collection kind="kerala"/>}/><Route path="/en/malabar-signatures" component={()=> <Collection kind="malabar"/>}/><Route path="/en/experiences" component={ExperienceIndex}/><Route path="/en/about" component={About}/><Route path="/en/contact" component={About}/><Route path="/en/south-indian-tours/:slug">{d&&southDetail?<DestinationDetail d={d} category="south"/>:<NotFound/>}</Route><Route path="/en/kerala-tours/:slug">{d&&keralaDetail?<DestinationDetail d={d} category="kerala"/>:<NotFound/>}</Route><Route path="/en/malabar-signatures/:slug">{d&&malabarDetail?<DestinationDetail d={d} category="malabar"/>:<NotFound/>}</Route><Route path="/en/experiences/mappila-malabar-arts/:slug">{artDetail?<ArtDetail slug={artDetail.slug}/>:<NotFound/>}</Route><Route path="/en/experiences/:slug">{exp?<ExperienceDetail experience={exp}/>:<NotFound/>}</Route><Route component={NotFound}/></Switch></Shell></ErrorBoundary>}
function App(){return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/,'')}><Router/></WouterRouter><Toaster/></TooltipProvider></QueryClientProvider>}
export default App;
