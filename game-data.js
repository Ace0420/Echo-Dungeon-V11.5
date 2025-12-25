// Echo Dungeon V11 - Game Data
// All game constants and data structures

const micButton = document.getElementById('micButton');
const textDisplay = document.getElementById('textDisplay');

let browserSupport = {
    speechSynthesis: false,
    speechRecognition: false,
    https: false
};

const game = {
    player: {
        class: '',
        level: 1,
        experience: 0,
        experienceToNext: 100,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        gold: 25,
        inventory: [],
        equippedRings: [],
        equippedBracelets: [],
        learnedAbilities: [],
        equippedAmulet: '',
        equippedShoulderItem: '',
        position: { x: 6, y: 6 },
        baseAttack: 15,
        defense: 0,
        weapon: '',
        armor: '',
        shield: '',
        helmet: '',
        gloves: '',
        boots: '',
        specialItems: [],
        activeEffects: [],
        junkBag: []
    },
    dungeon: {
        grid: {},
        size: 12,
        secretRoom: null,
        hasSecretRoom: false,
        currentLevel: 1 
    },
    currentRoom: null,
    combat: null,
    listening: false,
    started: false,
    needsClass: true,
    initialized: false,
    phase: 'init',
    merchantOpen: false,
    inspectMode: false,
    inspectItem: null
};

const classes = {
    warrior: {
        name: 'Warrior',
        health: 120,
        maxHealth: 120,
        mana: 30,
        maxMana: 30,
        gold: 50,
        items: ['Steel Sword', 'Large Health Potion', 'Large Health Potion', 'Chainmail', 'Iron Shield'],
        special: { name: 'Power Strike', damage: 100, cost: 15, type: 'damage' }
    },
    mage: { 
        name: 'Mage',
        health: 80,
        maxHealth: 80,
        mana: 100,
        maxMana: 100,
        gold: 75,
        items: ['Mystic Staff', 'Large Mana Potion', 'Large Health Potion', 'Enchanted Robes'],
        special: { name: 'Fireball', damage: 100, cost: 20, type: 'damage' } 
    },
    rogue: {
        name: 'Rogue',
        health: 100,
        maxHealth: 100,
        mana: 60,
        maxMana: 60,
        gold: 100,
        items: ['Shadow Daggers', 'Lockpicks', 'Large Health Potion', 'Shadow Leather'],
        special: { name: 'Backstab', damage: 75, cost: 15, type: 'damage' }
    }
};

const equipment = {
    weapons: [
        { name: 'Steel Sword', attack: 12, class: 'warrior', value: 100 },
        { name: 'Mystic Staff', attack: 8, mana: 15, class: 'mage', value: 150 },
        { name: 'Shadow Daggers', attack: 10, class: 'rogue', value: 120 },
        { name: 'Legendary Greatsword', attack: 25, class: 'warrior', value: 300 },
        { name: 'Archmage Staff', attack: 12, mana: 25, class: 'mage', value: 350 },
        { name: 'Vorpal Daggers', attack: 16, class: 'rogue', value: 320 },
        { name: 'Demon Slayer Blade', attack: 40, class: 'warrior', value: 500 },
        { name: 'Staff of the Cosmos', attack: 15, mana: 35, class: 'mage', value: 600 },
        { name: 'Ethereal Blades', attack: 22, class: 'rogue', value: 550 },
        { name: 'Godslayer Greatsword', attack: 30, class: 'warrior', value: 1000, minLevel: 6 },
        { name: 'Staff of Eternity', attack: 20, mana: 45, class: 'mage', value: 1200, minLevel: 6 },
        { name: 'Nightfall Daggers', attack: 32, class: 'rogue', value: 1100, minLevel: 6 },
        { name: 'Excalibur', attack: 50, class: 'warrior', value: 2000, minLevel: 8 },
        { name: 'Infinity Staff', attack: 25, mana: 60, class: 'mage', value: 2500, minLevel: 8 },
        { name: 'Oblivion Blades', attack: 42, class: 'rogue', value: 2200, minLevel: 8 },
        { name: 'Sword of the Ancients', attack: 100, class: 'warrior', value: 5000, minLevel: 10 },
        { name: 'Cosmic Scepter', attack: 70, mana: 80, class: 'mage', value: 6000, minLevel: 10 },
        { name: 'Void Assassin Blades', attack: 85, class: 'rogue', value: 5500, minLevel: 10 },
        { name: 'Blade of Titans', attack: 200, class: 'warrior', value: 10000, minLevel: 20 },
        { name: 'Staff of Creation', attack: 140, mana: 160, class: 'mage', value: 12000, minLevel: 20 },
        { name: 'Reality Ripper Daggers', attack: 170, class: 'rogue', value: 11000, minLevel: 20 },
        { name: 'Worldbreaker Sword', attack: 400, class: 'warrior', value: 20000, minLevel: 30 },
        { name: 'Genesis Core Staff', attack: 280, mana: 320, class: 'mage', value: 24000, minLevel: 30 },
        { name: 'Entropy Blades', attack: 340, class: 'rogue', value: 22000, minLevel: 30 }
    ],
    armor: [
        { name: 'Chainmail', defense: 10, class: 'warrior', value: 100 },
        { name: 'Enchanted Robes', defense: 5, class: 'mage', value: 120 },
        { name: 'Shadow Leather', defense: 6, class: 'rogue', value: 110 },
        { name: 'Dragonscale Plate', defense: 15, class: 'warrior', value: 350 },
        { name: 'Arcane Vestments', defense: 12, class: 'mage', value: 380 },
        { name: 'Phantom Suit', defense: 13, class: 'rogue', value: 360 },
        { name: 'Titanium Fortress', defense: 27, class: 'warrior', value: 550 },
        { name: 'Celestial Robes', defense: 18, mana: 25, class: 'mage', value: 600 },
        { name: 'Void Cloak', defense: 20, class: 'rogue', value: 580 },
        { name: 'Divine Plate', defense: 50, class: 'warrior', value: 1200, minLevel: 6 },
        { name: 'Robes of the Archmage', defense: 40, class: 'mage', value: 1100, minLevel: 6 },
        { name: 'Shadowweave Armor', defense: 45, class: 'rogue', value: 1150, minLevel: 6 },
        { name: 'Immortal Armor', defense: 80, class: 'warrior', value: 3000, minLevel: 8 },
        { name: 'Vestments of Infinity', defense: 65, mana: 60, class: 'mage', value: 2800, minLevel: 8 },
        { name: 'Cloak of Eternity', defense: 70, class: 'rogue', value: 2900, minLevel: 8 },
        { name: 'Armor of the Titans', defense: 150, class: 'warrior', value: 6000, minLevel: 10 },
        { name: 'Cosmic Vestments', defense: 120, mana: 90, class: 'mage', value: 7000, minLevel: 10 },
        { name: 'Void Emperor Cloak', defense: 130, class: 'rogue', value: 6500, minLevel: 10 },
        { name: 'Worldguard Plate', defense: 300, class: 'warrior', value: 12000, minLevel: 20 },
        { name: 'Reality Weave Robes', defense: 240, mana: 180, class: 'mage', value: 14000, minLevel: 20 },
        { name: 'Entropy Shroud', defense: 260, class: 'rogue', value: 13000, minLevel: 20 },
        { name: 'Godforge Armor', defense: 600, class: 'warrior', value: 24000, minLevel: 30 },
        { name: 'Genesis Vestments', defense: 480, mana: 360, class: 'mage', value: 28000, minLevel: 30 },
        { name: 'Oblivion Suit', defense: 520, class: 'rogue', value: 26000, minLevel: 30 }
    ],
    shields: [
        { name: 'Iron Shield', defense: 5, class: 'warrior', value: 80 },
        { name: 'Tower Shield', defense: 10, class: 'warrior', value: 250 },
        { name: 'Aegis Shield', defense: 15, class: 'warrior', value: 450 },
        { name: 'Shield of Heroes', defense: 35, class: 'warrior', value: 800, minLevel: 6 },
        { name: 'Bulwark of Ages', defense: 55, class: 'warrior', value: 1500, minLevel: 8 },
        { name: 'Titan Shield', defense: 100, class: 'warrior', value: 4000, minLevel: 10 },
        { name: 'Worldshield', defense: 200, class: 'warrior', value: 10000, minLevel: 20 },
        { name: 'Bulwark of Eternity', defense: 400, class: 'warrior', value: 20000, minLevel: 30 }
    ],
    helmets: [
        { name: 'Iron Helm', defense: 3, class: 'warrior', value: 50 },
        { name: 'Mage Hood', mana: 50, class: 'mage', value: 60 },
        { name: 'Shadow Mask', mana: 30, class: 'rogue', value: 55 },
        { name: 'Crown of Kings', defense: 38, class: 'warrior', value: 300, minLevel: 5 },
        { name: 'Circlet of Wisdom', mana: 120, class: 'mage', value: 350, minLevel: 5 },
        { name: 'Assassin Hood', mana: 50, class: 'rogue', value: 320, minLevel: 5 },
        { name: 'Helm of the Ancients', defense: 75, class: 'warrior', value: 3000, minLevel: 10 },
        { name: 'Crown of Cosmic Power', mana: 200, class: 'mage', value: 3500, minLevel: 10 },
        { name: 'Void Assassin Mask', mana: 150, class: 'rogue', value: 3200, minLevel: 10 },
        { name: 'Helm of Titans', defense: 150, class: 'warrior', value: 8000, minLevel: 20 },
        { name: 'Reality Crown', mana: 400, class: 'mage', value: 9000, minLevel: 20 },
        { name: 'Entropy Hood', mana: 300, class: 'rogue', value: 8500, minLevel: 20 },
        { name: 'Godhelm', defense: 300, class: 'warrior', value: 16000, minLevel: 30 },
        { name: 'Genesis Crown', mana: 800, class: 'mage', value: 18000, minLevel: 30 },
        { name: 'Oblivion Mask', mana: 600, class: 'rogue', value: 17000, minLevel: 30 }
    ],
    gloves: [
        { name: 'Leather Gloves', attack: 12, value: 40 },
        { name: 'Gauntlets of Strength', attack: 55, class: 'warrior', value: 200, minLevel: 4 },
        { name: 'Gloves of Casting', mana: 80, class: 'mage', value: 220, minLevel: 4 },
        { name: 'Shadow Grips', attack: 14, health: 30, class: 'rogue', value: 210, minLevel: 4 },
        { name: 'Titan Gauntlets', attack: 110, class: 'warrior', value: 2500, minLevel: 10 },
        { name: 'Cosmic Gloves', mana: 180, class: 'mage', value: 3000, minLevel: 10 },
        { name: 'Void Grips', attack: 95, health: 100, class: 'rogue', value: 2800, minLevel: 10 },
        { name: 'Worldbreaker Gauntlets', attack: 220, class: 'warrior', value: 7000, minLevel: 20 },
        { name: 'Reality Gloves', mana: 360, class: 'mage', value: 8000, minLevel: 20 },
        { name: 'Entropy Grips', attack: 190, health: 200, class: 'rogue', value: 7500, minLevel: 20 },
        { name: 'Godforged Gauntlets', attack: 440, class: 'warrior', value: 14000, minLevel: 30 },
        { name: 'Genesis Gloves', mana: 720, class: 'mage', value: 16000, minLevel: 30 },
        { name: 'Oblivion Grips', attack: 380, health: 400, class: 'rogue', value: 15000, minLevel: 30 }
    ],
    boots: [
        { name: 'Iron Boots', defense: 12, value: 35 },
        { name: 'Boots of Speed', mana: 15, value: 150, minLevel: 3 },
        { name: 'Greaves of the Titan', defense: 38, class: 'warrior', value: 300, minLevel: 5 },
        { name: 'Slippers of Wisdom', mana: 70, class: 'mage', value: 280, minLevel: 5 },
        { name: 'Boots of Shadow', health: 25, class: 'rogue', value: 320, minLevel: 5 },
        { name: 'Ancient Greaves', defense: 75, class: 'warrior', value: 2800, minLevel: 10 },
        { name: 'Cosmic Slippers', mana: 170, class: 'mage', value: 3200, minLevel: 10 },
        { name: 'Void Treads', health: 120, class: 'rogue', value: 3000, minLevel: 10 },
        { name: 'Titan Greaves', defense: 150, class: 'warrior', value: 7500, minLevel: 20 },
        { name: 'Reality Slippers', mana: 340, class: 'mage', value: 8500, minLevel: 20 },
        { name: 'Entropy Boots', health: 250, class: 'rogue', value: 8000, minLevel: 20 },
        { name: 'Worldstep Greaves', defense: 300, class: 'warrior', value: 15000, minLevel: 30 },
        { name: 'Genesis Slippers', mana: 680, class: 'mage', value: 17000, minLevel: 30 },
        { name: 'Oblivion Treads', health: 500, class: 'rogue', value: 16000, minLevel: 30 }
    ],
    bracelets: [
        { name: 'Bronze Bracelet', attack: 5, mana: 0, value: 100 },
        { name: 'Silver Bracelet', attack: 10, mana: 20, value: 300, minLevel: 3 },
        { name: 'Gold Bracelet', attack: 15, mana: 40, value: 800, minLevel: 5 },
        { name: 'Platinum Bracelet', attack: 25, mana: 70, value: 2000, minLevel: 8 },
        { name: 'Ancient Bracelet', attack: 50, mana: 120, value: 5000, minLevel: 10 },
        { name: 'Titan Bracelet', attack: 100, mana: 240, value: 10000, minLevel: 20 },
        { name: 'Reality Bracelet', attack: 200, mana: 480, value: 20000, minLevel: 30 }
    ],
    shoulderItems: [
        { name: 'Battle Banner', effect: 'warrior_damage', bonus: 0.5, class: 'warrior', value: 2000, minLevel: 5, description: '+50% attack damage' },
        { name: 'Arcane Scarf', effect: 'mage_spell', bonus: 0.5, class: 'mage', value: 2000, minLevel: 5, description: '+50% spell damage' },
        { name: 'Spelled Cat Stole', effect: 'rogue_stealth', bonus: 0.5, class: 'rogue', value: 2000, minLevel: 5, description: '+50% stealth damage' },
        { name: 'Titan War Banner', effect: 'warrior_damage', bonus: 1.0, class: 'warrior', value: 10000, minLevel: 20, description: '+100% attack damage' },
        { name: 'Cosmic Mantle', effect: 'mage_spell', bonus: 1.0, class: 'mage', value: 10000, minLevel: 20, description: '+100% spell damage' },
        { name: 'Shadow Cloak Stole', effect: 'rogue_stealth', bonus: 1.0, class: 'rogue', value: 10000, minLevel: 20, description: '+100% stealth damage' }
    ]
};

const abilities = [
    { name: 'Icy Blast', damage: 100, cost: 20, type: 'freeze', description: 'Deals damage and freezes enemy for 1 turn', class: 'mage' },
    { name: 'Shield Bash', damage: 80, cost: 20, type: 'stun', description: 'Stun enemy for one turn', class: 'warrior' },
    { name: 'Poison Blade', damage: 40, cost: 20, type: 'poison', duration: 3, description: 'Poison damages 15 per turn for 3 turns', class: 'rogue' },
    { name: 'Chain Lightning', damage: 95, cost: 25, type: 'damage', description: 'Devastating lightning attack', class: 'mage' },
    { name: 'Arcane Missiles', damage: 105, cost: 15, type: 'aoe', description: 'Magic missiles hit all enemies', class: 'mage' },
    { name: 'Whirlwind', damage: 70, cost: 25, type: 'aoe', description: 'Spin attack hitting all enemies', class: 'warrior' },
    { name: 'Shadow Strike', damage: 40, cost: 20, type: 'sneak', description: 'Strike from shadows without enemy retaliation', class: 'rogue' },
    { name: 'Meteor Storm', damage: 145, cost: 40, type: 'aoe', description: 'Massive fire damage to all enemies', class: 'mage', minLevel: 5 },
    { name: 'Titan Smash', damage: 190, cost: 35, type: 'damage', description: 'Devastating single target attack', class: 'warrior', minLevel: 5 },
    { name: 'Assassinate', damage: 125, cost: 30, type: 'sneak', description: 'Massive stealth strike with no counter', class: 'rogue', minLevel: 5 },
    { name: 'Time Stop', damage: 0, cost: 60, type: 'timestop', description: 'Freeze all enemies for 2 turns', class: 'mage', minLevel: 6 },
    { name: 'Berserker Rage', damage: 105, cost: 30, type: 'rage', description: 'Triple attack on single target', class: 'warrior', minLevel: 6 },
    { name: 'Vanish', damage: 0, cost: 25, type: 'vanish', description: 'Become invisible, next attack deals 200% damage', class: 'rogue', minLevel: 6 },
    { name: 'Divine Smite', damage: 200, cost: 60, type: 'damage', description: 'Holy damage that ignores defense', class: 'warrior', minLevel: 8 },
    { name: 'Black Hole', damage: 250, cost: 55, type: 'aoe', description: 'Void magic crushes all foes', class: 'mage', minLevel: 8 },
    { name: 'Death Mark', damage: 100, cost: 35, type: 'mark', description: 'Mark enemy for 50% more damage taken', class: 'rogue', minLevel: 8 },
    { name: 'Cosmic Devastation', damage: 600, cost: 100, type: 'aoe', description: 'Ultimate spell destroys all enemies', class: 'mage', minLevel: 10 },
    { name: 'Annihilation', damage: 800, cost: 70, type: 'damage', description: 'Total destruction single target', class: 'warrior', minLevel: 10 },
    { name: 'Soul Reaper', damage: 500, cost: 60, type: 'sneak', description: 'Harvest souls from the shadows', class: 'rogue', minLevel: 10 },
    { name: 'Supernova', damage: 1200, cost: 200, type: 'aoe', description: 'Star-destroying power', class: 'mage', minLevel: 20 },
    { name: 'World Shatter', damage: 1600, cost: 140, type: 'damage', description: 'Break reality itself', class: 'warrior', minLevel: 20 },
    { name: 'Entropy Strike', damage: 1000, cost: 120, type: 'sneak', description: 'Unravel existence', class: 'rogue', minLevel: 20 },
    { name: 'Genesis Beam', damage: 2400, cost: 400, type: 'aoe', description: 'Create and destroy universes', class: 'mage', minLevel: 30 },
    { name: 'Oblivion Crash', damage: 3200, cost: 280, type: 'damage', description: 'The end of everything', class: 'warrior', minLevel: 30 },
    { name: 'Void Erasure', damage: 2000, cost: 240, type: 'sneak', description: 'Remove from all timelines', class: 'rogue', minLevel: 30 }
];

const amulets = [
    { name: 'Amulet of Vitality', effect: '+15 Max Health', stat: 'maxHealth', value: 15 },
    { name: 'Amulet of Mana', effect: '+15 Max Mana', stat: 'maxMana', value: 15 },
    { name: 'Amulet of Experience', effect: '+20% Experience Gain', stat: 'expGain', value: 30 },
    { name: 'Amulet of the Archmage', effect: '+30 Max Mana', stat: 'maxMana', value: 30 },
    { name: 'Amulet of the Titan', effect: '+30 Max Health', stat: 'maxHealth', value: 30 },
    { name: 'Amulet of Power', effect: '+5 Attack', stat: 'attack', value: 5 },
    { name: 'Ancient Amulet', effect: '+100 Max Health', stat: 'maxHealth', value: 100, minLevel: 10 },
    { name: 'Cosmic Amulet', effect: '+200 Max Mana', stat: 'maxMana', value: 200, minLevel: 10 },
    { name: 'Amulet of Destruction', effect: '+30 Attack', stat: 'attack', value: 30, minLevel: 10 },
    { name: 'Titan Amulet', effect: '+250 Max Health', stat: 'maxHealth', value: 250, minLevel: 20 },
    { name: 'Reality Amulet', effect: '+400 Max Mana', stat: 'maxMana', value: 400, minLevel: 20 },
    { name: 'Worldbreaker Amulet', effect: '+75 Attack', stat: 'attack', value: 75, minLevel: 20 },
    { name: 'Genesis Amulet', effect: '+500 Max Health', stat: 'maxHealth', value: 500, minLevel: 30 },
    { name: 'Oblivion Amulet', effect: '+800 Max Mana', stat: 'maxMana', value: 800, minLevel: 30 },
    { name: 'God Slayer Amulet', effect: '+150 Attack', stat: 'attack', value: 150, minLevel: 30 }
];

const treasures = [
    { name: 'Sapphire Gem', value: 50 },
    { name: 'Ruby Gem', value: 75 },
    { name: 'Diamond', value: 100 },
    { name: 'Emerald', value: 60 },
    { name: 'Ancient Coin Collection', value: 40 },
    { name: 'Golden Chalice', value: 80 },
    { name: 'Silver Crown', value: 90 },
    { name: 'Enchanted Amulet', value: 120 }
];

const rings = [
    { name: 'Ring of Vitality', effect: '+10 Max Health', stat: 'maxHealth', value: 10 },
    { name: 'Ring of Minor Mana', effect: '+40 Max Mana', stat: 'maxMana', value: 10 },
    { name: 'Ring of Protection', effect: '+50 Max Health', stat: 'maxHealth', value: 5 },
    { name: 'Ring of Strength', effect: '+4 Attack Damage', stat: 'attack', value: 2 },
    { name: 'Ring of Wisdom', effect: '+8 Max Mana', stat: 'maxMana', value: 5 },
    { name: 'Ring of the Titan', effect: '+20 Max Health', stat: 'maxHealth', value: 20 },
    { name: 'Ring of Arcane Power', effect: '+15 Max Mana', stat: 'maxMana', value: 15 },
    { name: 'Ring of the Berserker', effect: '+6 Attack Damage', stat: 'attack', value: 4 },
    { name: 'Ring of Regeneration', effect: 'Restore 50 health per turn in combat', stat: 'regen', value: 50 },
    { name: 'Ancient Ring', effect: '+75 Max Health', stat: 'maxHealth', value: 75, minLevel: 10 },
    { name: 'Cosmic Ring', effect: '+150 Max Mana', stat: 'maxMana', value: 150, minLevel: 10 },
    { name: 'Ring of Devastation', effect: '+20 Attack Damage', stat: 'attack', value: 20, minLevel: 10 },
    { name: 'Titan Ring', effect: '+200 Max Health', stat: 'maxHealth', value: 200, minLevel: 20 },
    { name: 'Reality Ring', effect: '+300 Max Mana', stat: 'maxMana', value: 300, minLevel: 20 },
    { name: 'Worldbreaker Ring', effect: '+50 Attack Damage', stat: 'attack', value: 50, minLevel: 20 },
    { name: 'Genesis Ring', effect: '+400 Max Health', stat: 'maxHealth', value: 400, minLevel: 30 },
    { name: 'Oblivion Ring', effect: '+600 Max Mana', stat: 'maxMana', value: 600, minLevel: 30 },
    { name: 'God Ring', effect: '+100 Attack Damage', stat: 'attack', value: 100, minLevel: 30 }
];

const enemies = {
    goblin: { name: 'Goblin', health: 130, damage: 18, gold: 5, exp: 25, fleeChance: 0.8 },
    skeleton: { name: 'Skeleton', health: 140, damage: 20, gold: 8, exp: 30, fleeChance: 0.7 },
    orc: { name: 'Orc', health: 160, damage: 35, gold: 12, exp: 50, fleeChance: 0.5 },
    wraith: { name: 'Wraith', health: 150, damage: 38, gold: 15, exp: 75, fleeChance: 0.6 },
    troll: { name: 'Troll', health: 180, damage: 50, gold: 20, exp: 65, fleeChance: 0.4, regenerate: 5 },
    dragon: { name: 'Dragon', health: 350, damage: 75, gold: 50, exp: 450, fleeChance: 0.1 },
    demon: { name: 'Demon', health: 190, damage: 58, gold: 45, exp: 80, fleeChance: 0.3 },
    vampire: { name: 'Vampire', health: 200, damage: 95, gold: 40, exp: 100, fleeChance: 0.4, regenerate: 8 },
    orcChieftain: { name: 'Orc Chieftain', health: 190, damage: 72, gold: 25, exp: 65, fleeChance: 0.3 },
    ancientWraith: { name: 'Ancient Wraith', health: 190, damage: 96, gold: 30, exp: 80, fleeChance: 0.4 },
    elderTroll: { name: 'Elder Troll', health: 250, damage: 28, gold: 40, exp: 100, fleeChance: 0.2, regenerate: 10 },
    archDemon: { name: 'Arch Demon', health: 280, damage: 95, gold: 70, exp: 160, fleeChance: 0.2 },
    hydra: { name: 'Hydra', health: 240, damage: 130, gold: 55, exp: 125, fleeChance: 0.3, regenerate: 12 },
    phoenixGuardian: { name: 'Phoenix Guardian', health: 230, damage: 132, gold: 60, exp: 145, fleeChance: 0.3, regenerate: 15 },
    lichKing: { name: 'Lich King', health: 160, damage: 38, gold: 80, exp: 185, fleeChance: 0.1, regenerate: 10 },
    ancientDragon: { name: 'Ancient Dragon', health: 600, damage: 150, gold: 200, exp: 800, fleeChance: 0.05, regenerate: 20 },
    demonLord: { name: 'Demon Lord', health: 550, damage: 180, gold: 250, exp: 900, fleeChance: 0.05, regenerate: 25 },
    voidBeast: { name: 'Void Beast', health: 700, damage: 200, gold: 300, exp: 1000, fleeChance: 0.03, regenerate: 30 },
    cosmicHorror: { name: 'Cosmic Horror', health: 800, damage: 220, gold: 350, exp: 1200, fleeChance: 0.03, regenerate: 35 },
    titanLord: { name: 'Titan Lord', health: 1000, damage: 250, gold: 400, exp: 1500, fleeChance: 0.02, regenerate: 40 },
    harbingerOfRagnarok: { name: 'Harbinger of Ragnarok', health: 1500, damage: 300, gold: 600, exp: 2500, fleeChance: 0.01, regenerate: 50 },
    voidEmperor: { name: 'Void Emperor', health: 2000, damage: 350, gold: 800, exp: 3500, fleeChance: 0.01, regenerate: 60 },
    apocalypseTitan: { name: 'Apocalypse Titan', health: 2500, damage: 400, gold: 1000, exp: 5000, fleeChance: 0.01, regenerate: 75 },
    worldEater: { name: 'World Eater', health: 5000, damage: 800, gold: 2000, exp: 10000, fleeChance: 0.01, regenerate: 150 },
    realityBender: { name: 'Reality Bender', health: 8000, damage: 1200, gold: 3000, exp: 15000, fleeChance: 0.01, regenerate: 200 },
    genesisLord: { name: 'Genesis Lord', health: 10000, damage: 1600, gold: 5000, exp: 25000, fleeChance: 0.01, regenerate: 300 }
};

const merchantItems = [
    { name: 'Large Health Potion', type: 'potion', price: 50, healing: 50 },
    { name: 'Large Mana Potion', type: 'potion', price: 40, mana: 30 },
    { name: 'Greater Health Potion', type: 'potion', price: 100, healing: 100 },
    { name: 'Greater Mana Potion', type: 'potion', price: 80, mana: 75 },
    { name: 'Supreme Health Potion', type: 'potion', price: 300, healing: 300, minLevel: 10 },
    { name: 'Supreme Mana Potion', type: 'potion', price: 250, mana: 200, minLevel: 10 },
    { name: 'Ultimate Health Potion', type: 'potion', price: 800, healing: 800, minLevel: 20 },
    { name: 'Ultimate Mana Potion', type: 'potion', price: 700, mana: 500, minLevel: 20 },
    { name: 'Godly Health Elixir', type: 'potion', price: 2000, healing: 2000, minLevel: 30 },
    { name: 'Godly Mana Elixir', type: 'potion', price: 1800, mana: 1500, minLevel: 30 },
    { name: 'Elixir of Immortality', type: 'special_potion', price: 400, effect: 'revive', description: 'Auto-revive on death with 50% health' },
    { name: 'Potion of Giant Strength', type: 'special_potion', price: 300, effect: 'strength', duration: 3, description: 'Double attack damage for 3 battles' },
    { name: 'Elixir of Clarity', type: 'special_potion', price: 350, effect: 'clarity', description: 'All spells cost 50% less mana for 3 battles' },
    { name: 'Legendary Warhammer', type: 'weapon', price: 3500, attack: 65, class: 'warrior', description: 'Crushes all opposition' },
    { name: 'Staff of Ultimate Power', type: 'weapon', price: 4000, attack: 40, mana: 100, class: 'mage', description: 'Limitless arcane potential' },
    { name: 'Blades of the Phantom King', type: 'weapon', price: 3800, attack: 55, class: 'rogue', description: 'Strike from any shadow' },
    { name: 'Fortress Armor', type: 'armor', price: 4500, defense: 80, class: 'warrior', description: 'Impenetrable defense' },
    { name: 'Robes of Ultimate Magic', type: 'armor', price: 5000, defense: 60, mana: 120, class: 'mage', description: 'Channel infinite power' },
    { name: 'Suit of the Shadow Emperor', type: 'armor', price: 4800, defense: 70, class: 'rogue', description: 'One with darkness' },
    { name: 'Shield of the Immortal', type: 'shield', price: 5500, defense: 90, class: 'warrior', description: 'Nothing can harm you', minLevel: 10 },
    { name: 'Crown of Absolute Power', type: 'helmet', price: 6000, defense: 100, mana: 150, description: 'Ultimate authority', minLevel: 10 },
    { name: 'Gauntlets of the God Slayer', type: 'gloves', price: 5500, attack: 100, mana: 100, description: 'Destroy the divine', minLevel: 10 },
    { name: 'Boots of Infinity', type: 'boots', price: 5000, defense: 80, mana: 120, health: 150, description: 'Walk forever', minLevel: 10 },
    { name: 'Bracelet of the Cosmos', type: 'bracelet', price: 8000, attack: 80, mana: 200, description: 'Harness cosmic power', minLevel: 10 },
    { name: 'Bracelet of Annihilation', type: 'bracelet', price: 15000, attack: 150, mana: 350, description: 'Destroy all creation', minLevel: 20 }
];

const roomTypes = {
    entrance: { 
        descriptions: [
            'the grand entrance hall. Torches flicker on ancient stone walls.',
            'the entrance chamber. A faded tapestry hangs on the north wall.',
            'the starting hall. Cobwebs drape from vaulted ceilings above.'
        ], 
        hasEnemy: false 
    },
    empty: { 
        descriptions: [
            'an abandoned barracks. Rusty weapons litter the floor.',
            'a collapsed library. Torn pages scatter at your feet.',
            'a crumbling shrine. A broken altar stands in the center.',
            'a forgotten armory. Empty weapon racks line the walls.',
            'a dusty workshop. Ancient tools hang from hooks.',
            'a meditation chamber. Stone benches circle a dry fountain.',
            'an old prison cell. Iron bars have rusted through.',
            'a guard post. A skeleton sits slumped in a chair.'
        ], 
        hasEnemy: false 
    },
    treasure: { 
        descriptions: [
            'a glittering treasure vault. Gold coins reflect torchlight.',
            'a dragon\'s hoard chamber. Piles of jewels gleam in the darkness.',
            'a royal treasury. Ancient chests overflow with riches.',
            'a pirate\'s cache. Stolen goods fill every corner.',
            'a wizard\'s vault. Magical artifacts pulse with energy.'
        ], 
        hasEnemy: false 
    },
    enemy: { 
        descriptions: [
            'a dark chamber. You sense hostile eyes watching you.',
            'a blood-stained arena. Old battle scars mark the floor.',
            'a shadowy lair. Something growls in the darkness.',
            'a monster\'s den. Bones crunch beneath your feet.',
            'a cursed chamber. An evil presence fills the air.'
        ], 
        hasEnemy: true 
    },
    boss: { 
        descriptions: [
            'the throne room of darkness. A massive beast awaits on a stone throne.',
            'the dragon\'s lair. Heat radiates from the enormous creature before you.',
            'the demon king\'s chamber. Dark energy swirls around your foe.'
        ], 
        hasEnemy: true 
    },
    trap: { 
        descriptions: [
            'a trapped corridor. Pressure plates cover the floor.',
            'a spike-filled chamber. Deadly traps line the walls.',
            'a poison gas room. Strange vapors seep from cracks.'
        ], 
        hasEnemy: false 
    },
    stairs: { 
        descriptions: [
            'a spiral stairwell. Dark stone steps descend into deeper darkness.',
            'a grand staircase. Ancient carvings decorate the descent.',
            'a hidden passage. Secret stairs lead to the next level.'
        ], 
        hasEnemy: false 
    },
    fountain: {
        descriptions: [
            'a magical fountain room. Crystal clear water bubbles from an enchanted spring.',
            'an ancient healing shrine. A mystical fountain glows with restorative power.'
        ],
        hasEnemy: false
    },
    crypt: {
        descriptions: [
            'a dusty crypt. Stone sarcophagi line the walls.',
            'an ancient burial chamber. Skeletal remains rest in alcoves.',
            'a forgotten tomb. Hieroglyphs cover every surface.'
        ],
        hasEnemy: false
    },
    merchant: {
        descriptions: [
            'a merchant\'s tent. A hooded figure tends to various wares.',
            'a traveling shop. Mysterious goods line makeshift shelves.'
        ],
        hasEnemy: false
    }
};

// List of all potion names (used for junk bag exclusion)
const potionNames = [
    'Large Health Potion', 'Greater Health Potion', 'Supreme Health Potion', 
    'Ultimate Health Potion', 'Godly Health Elixir',
    'Large Mana Potion', 'Greater Mana Potion', 'Supreme Mana Potion', 
    'Ultimate Mana Potion', 'Godly Mana Elixir',
    'Elixir of Immortality', 'Potion of Giant Strength', 'Elixir of Clarity'
];

console.log('game-data.js loaded successfully');
