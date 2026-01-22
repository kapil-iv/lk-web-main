export const games = [
  ...Array.from({ length: 25 }, (_, i) => {
    const id = i + 1;
    const sports = [
      { name: "Cricket", type: "11 a side", imgId: "cricket" },
      { name: "Football", type: "7 a side", imgId: "soccer" },
      { name: "Badminton", type: "Doubles", imgId: "badminton" },
      { name: "Tennis", type: "Singles", imgId: "tennis" },
      { name: "Table Tennis", type: "Singles", imgId: "pingpong" }
    ];
    
    const bikanerLocs = [
      "Dr. Karni Singh Stadium, JNV Colony",
      "Shardul Club Ground, Near Collectorate",
      "Railway Stadium, Bikaner",
      "Rajasthan Veterinary College Ground",
      "Beechwal Sports Complex",
      "Ganga City School Grounds",
      "JNV Sector 5 Public Park",
      "Lallgarh Palace Turf"
    ];

    const organizers = ["Amit R.", "Vikram Singh", "Suresh Vyas", "Rahul Bika", "Priya K.", "Sunil Bishnoi", "Harsh S."];
    const selectedSport = sports[Math.floor(Math.random() * sports.length)];
    const randomSlots = Math.floor(Math.random() * 8) + 1;
    
    // Using LoremFlickr for sport-related action shots and Robohash for unique avatars
    return {
      id: id,
      type: selectedSport.type,
      category: Math.random() > 0.2 ? "regular" : "tournament",
      organizer: organizers[Math.floor(Math.random() * organizers.length)],
      karma: Math.floor(Math.random() * 12000) + 100,
      date: id % 2 === 0 ? "Thu, 01 Jan 2026" : "Fri, 02 Jan 2026",
      time: `${Math.floor(Math.random() * 4) + 4}:00 PM - ${Math.floor(Math.random() * 3) + 8}:00 PM`,
      location: bikanerLocs[Math.floor(Math.random() * bikanerLocs.length)],
      distance: (Math.random() * 6).toFixed(1) + " Kms",
      status: Math.random() > 0.4 ? `🚀 Only ${randomSlots} Slots left` : `${Math.floor(Math.random() * 15) + 2} Going`,
      level: ["Beginner", "Intermediate", "Professional"][Math.floor(Math.random() * 3)],
      badge: Math.random() > 0.8 ? "Top Rated" : Math.random() > 0.9 ? "Pro" : null,
      // Faker-style dynamic image for the sport
      sportIcon: `https://loremflickr.com/100/100/${selectedSport.imgId}?lock=${id}`,
      // Faker-style unique avatars for users
      profiles: [
        `https://robohash.org/${id + 100}?set=set4`, 
        `https://robohash.org/${id + 200}?set=set4`
      ].slice(0, Math.floor(Math.random() * 2) + 1)
    };
  })
];
