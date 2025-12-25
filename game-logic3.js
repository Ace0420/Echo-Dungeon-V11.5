// Echo Dungeon V11 - Game Logic Part 3
// Dungeon, movement, potions, spells, info, save/load, commands, init

// ============================================
// DUNGEON GENERATION
// ============================================

function getRandomDescription(roomType) {
    const descriptions = roomTypes[roomType].descriptions;
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateDungeon() {
    const size = game.dungeon.size;
    const currentLevel = game.dungeon.currentLevel;
    game.dungeon.grid = {};
    
    const centerX = 6; 
    const centerY = 6;
    
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const key = `${x},${y}`;
            const distanceX = Math.abs(x - centerX);
            const distanceY = Math.abs(y - centerY);
            const distanceFromCenter = distanceX + distanceY;
            
            let roomData = { visited: false, searched: false, hasChest: false, fountainUsed: false };

            if (x === centerX && y === centerY) {
                game.dungeon.grid[key] = { 
                    type: 'entrance', 
                    description: getRandomDescription('entrance'),
                    ...roomData
                };
            } else if (x === size - 1 && y === size - 1) { 
                let bossEnemy = null;
                
                if (currentLevel >= 30) {
                    bossEnemy = scaleEnemyForLevel(enemies.genesisLord, currentLevel);
                } else if (currentLevel >= 20) {
                    bossEnemy = scaleEnemyForLevel(enemies.apocalypseTitan, currentLevel);
                } else if (currentLevel >= 10) {
                    bossEnemy = scaleEnemyForLevel(enemies.voidEmperor, currentLevel);
                } else {
                    bossEnemy = scaleEnemyForLevel(enemies.dragon, currentLevel);
                }
                
                game.dungeon.grid[key] = {
                    type: 'boss',
                    description: getRandomDescription('boss'),
                    ...roomData,
                    hasChest: true,
                    enemy: bossEnemy
                };
            } else if (x === size - 1 && y === size - 2) { 
                game.dungeon.grid[key] = { 
                    type: 'stairs', 
                    description: getRandomDescription('stairs'),
                    ...roomData 
                };
            } else {
                let roomType = null;
                let enemyType = null;
                
                const roll = Math.random();
                const isElite = currentLevel >= 2 && Math.random() < 0.15;
                
                if (Math.random() < 0.1) {
                    game.dungeon.grid[key] = {
                        type: 'merchant',
                        description: getRandomDescription('merchant'),
                        ...roomData
                    };
                    continue;
                }
                
                if (distanceFromCenter >= 7) {
                    if (roll < 0.5) {
                        roomType = 'enemy';
                        if (currentLevel >= 30) {
                            enemyType = Math.random() < 0.4 ? 'genesisLord' : (Math.random() < 0.5 ? 'realityBender' : 'worldEater');
                        } else if (currentLevel >= 20) {
                            enemyType = Math.random() < 0.4 ? 'harbingerOfRagnarok' : (Math.random() < 0.5 ? 'voidBeast' : 'titanLord');
                        } else if (currentLevel >= 10) {
                            enemyType = Math.random() < 0.4 ? (Math.random() < 0.5 ? 'cosmicHorror' : 'titanLord') : (isElite ? 'demonLord' : (Math.random() < 0.5 ? 'ancientDragon' : 'voidBeast'));
                        } else if (currentLevel >= 5) {
                            enemyType = Math.random() < 0.4 ? (Math.random() < 0.5 ? 'hydra' : 'phoenixGuardian') : (isElite ? 'archDemon' : (Math.random() < 0.5 ? 'demon' : 'vampire'));
                        } else if (isElite) {
                            enemyType = currentLevel >= 3 ? 'archDemon' : 'elderTroll';
                        } else if (currentLevel >= 3) {
                            enemyType = Math.random() < 0.5 ? 'demon' : 'vampire';
                        } else {
                            enemyType = Math.random() < 0.5 ? 'troll' : 'wraith';
                        }
                    } else if (roll < 0.7) {
                        roomType = 'treasure';
                        roomData.hasChest = true;
                    } else if (roll < 0.8) {
                        roomType = 'fountain';
                    } else {
                        roomType = 'crypt';
                        roomData.hasChest = Math.random() < 0.3;
                    }
                } else if (distanceFromCenter >= 4) {
                    if (roll < 0.45) {
                        roomType = 'enemy';
                        if (currentLevel >= 30) {
                            enemyType = Math.random() < 0.3 ? 'worldEater' : (isElite ? 'realityBender' : (Math.random() < 0.5 ? 'harbingerOfRagnarok' : 'apocalypseTitan'));
                        } else if (currentLevel >= 20) {
                            enemyType = Math.random() < 0.3 ? 'cosmicHorror' : (isElite ? 'voidBeast' : (Math.random() < 0.5 ? 'demonLord' : 'ancientDragon'));
                        } else if (currentLevel >= 10) {
                            enemyType = Math.random() < 0.3 ? 'voidBeast' : (isElite ? 'ancientDragon' : (Math.random() < 0.5 ? 'demonLord' : 'lichKing'));
                        } else if (currentLevel >= 5) {
                            enemyType = Math.random() < 0.3 ? 'lichKing' : (isElite ? 'elderTroll' : (Math.random() < 0.5 ? 'wraith' : 'troll'));
                        } else if (isElite) {
                            enemyType = currentLevel >= 2 ? 'ancientWraith' : 'orcChieftain';
                        } else if (currentLevel >= 2) {
                            enemyType = Math.random() < 0.5 ? 'wraith' : 'troll';
                        } else {
                            enemyType = Math.random() < 0.6 ? 'orc' : 'skeleton';
                        }
                    } else if (roll < 0.65) {
                        roomType = 'treasure';
                        roomData.hasChest = true;
                    } else if (roll < 0.75) {
                        roomType = 'trap';
                    } else if (roll < 0.8) {
                        roomType = 'fountain';
                    } else {
                        roomType = 'empty';
                        roomData.hasChest = Math.random() < 0.2;
                    }
                } else {
                    if (roll < 0.35) {
                        roomType = 'enemy';
                        if (isElite) {
                            enemyType = 'orcChieftain';
                        } else if (currentLevel >= 2) {
                            enemyType = Math.random() < 0.5 ? 'orc' : 'skeleton';
                        } else {
                            enemyType = 'goblin';
                        }
                    } else if (roll < 0.55) {
                        roomType = 'treasure';
                        roomData.hasChest = true;
                    } else if (roll < 0.6) {
                        roomType = 'fountain';
                    } else {
                        roomType = 'empty';
                        roomData.hasChest = Math.random() < 0.15;
                    }
                }
                
                if (roomType === 'enemy' && enemyType) {
                    let scaledEnemy = scaleEnemyForLevel(enemies[enemyType], currentLevel);
                    
                    if (currentLevel >= 3 && Math.random() < 0.2) {
                        game.dungeon.grid[key] = {
                            type: 'enemy',
                            description: getRandomDescription('enemy') + ' Two creatures lurk here!',
                            ...roomData,
                            enemy: scaledEnemy,
                            secondEnemy: scaleEnemyForLevel(enemies[enemyType], currentLevel)
                        };
                    } else {
                        game.dungeon.grid[key] = {
                            type: 'enemy',
                            description: getRandomDescription('enemy'),
                            ...roomData,
                            enemy: scaledEnemy
                        };
                    }
                } else if (roomType) {
                    game.dungeon.grid[key] = {
                        type: roomType,
                        description: getRandomDescription(roomType),
                        ...roomData
                    };
                } else {
                    game.dungeon.grid[key] = {
                        type: 'empty',
                        description: getRandomDescription('empty'),
                        ...roomData
                    };
                }
            }
        }
    }
    
    if (Math.random() < 0.3) {
        game.dungeon.hasSecretRoom = true;
    }
    
    game.player.position = { x: 6, y: 6 };
    const key = `${game.player.position.x},${game.player.position.y}`;
    game.currentRoom = game.dungeon.grid[key];
}

// ============================================
// MOVEMENT
// ============================================

function move(direction) {
    const { x, y } = game.player.position;
    let newX = x, newY = y;
    
    if (direction === 'north') newY--;
    else if (direction === 'south') newY++;
    else if (direction === 'east') newX++;
    else if (direction === 'west') newX--;
    
    if (newX < 0 || newX >= game.dungeon.size || newY < 0 || newY >= game.dungeon.size) {
        speak('You cannot go that way. A solid wall blocks your path.');
        return;
    }
    
    game.player.position = { x: newX, y: newY };
    const key = `${newX},${newY}`;
    game.currentRoom = game.dungeon.grid[key];
    
    if (game.currentRoom.type === 'trap' && !game.currentRoom.visited) {
        const trapDamage = 15 + (game.dungeon.currentLevel * 5);
        game.player.health -= trapDamage;
        speak(`A trap springs! You take ${trapDamage} damage! Health: ${game.player.health}.`);
        if (game.player.health <= 0) {
            setTimeout(() => gameOver(), 1000);
            return;
        }
    }

    game.currentRoom.visited = true;
    describeRoom();
}

function describeRoom() {
    const room = game.currentRoom;
    const messages = [`You are on Level ${game.dungeon.currentLevel} in ${room.description}`];
    
    if (room.type === 'stairs') {
        messages.push('Dark stairs descend deeper. Say "go down stairs" to descend.');
    } else if (room.type === 'merchant') {
        messages.push('A traveling merchant is here. Say "merchant" to trade.');
    } else if (room.type === 'fountain' && !room.fountainUsed) {
        messages.push('A magical fountain bubbles here. Say "drink fountain" to be healed.');
    } else if (room.enemy && room.enemy.health > 0) {
        if (room.secondEnemy && room.secondEnemy.health > 0) {
            messages.push(`A ${room.enemy.name} and a ${room.secondEnemy.name} block your path!`);
        } else {
            messages.push(`A ${room.enemy.name} blocks your path!`);
        }
        speakSequence(messages, () => {
            setTimeout(() => startCombat(room.enemy, room.secondEnemy), 1000);
        });
        return;
    } else {
        if (room.hasChest && !room.searched) {
            messages.push('A treasure chest glimmers in the shadows. Say "open chest" to loot it.');
        }
        if (!room.searched && room.type !== 'stairs') {
            messages.push('You could search this room.');
        }
    }
    messages.push('Which direction will you go?');
    speakSequence(messages);
}

function useFountain() {
    if (game.currentRoom.type !== 'fountain') {
        speak('There is no fountain here.');
        return;
    }
    if (game.currentRoom.fountainUsed) {
        speak('The fountain has run dry. Its magic is spent.');
        return;
    }
    
    game.currentRoom.fountainUsed = true;
    game.player.health = game.player.maxHealth;
    game.player.mana = game.player.maxMana;
    
    speak('You drink from the magical fountain. You are fully healed and restored!');
}

function useStairs() {
    if (game.currentRoom.type !== 'stairs') {
        speak('There are no stairs here.');
        return;
    }
    
    const bossKey = `${game.dungeon.size - 1},${game.dungeon.size - 1}`;
    const bossRoom = game.dungeon.grid[bossKey];
    if (bossRoom.enemy && bossRoom.enemy.health > 0) {
        speak('You must defeat the boss in the boss room first.');
        return;
    }
    
    game.dungeon.currentLevel++;
    generateDungeon(); 

    speak(`You descend to Dungeon Level ${game.dungeon.currentLevel}. The air grows colder and more dangerous.`, () => {
        describeRoom();
    });
}

// ============================================
// LOOT AND SEARCHING
// ============================================

function determineLoot() {
    const level = game.dungeon.currentLevel;
    const roll = Math.random();
    const playerClass = game.player.class;
    
    if (level >= 30 && roll < 0.25) {
        const allGodly = [
            ...equipment.weapons.filter(w => w.minLevel >= 30 && w.class === playerClass),
            ...equipment.armor.filter(a => a.minLevel >= 30 && a.class === playerClass),
            ...equipment.helmets.filter(h => h.minLevel >= 30 && (!h.class || h.class === playerClass)),
            ...equipment.gloves.filter(g => g.minLevel >= 30 && (!g.class || g.class === playerClass)),
            ...equipment.boots.filter(b => b.minLevel >= 30 && (!b.class || b.class === playerClass)),
            ...equipment.bracelets.filter(br => br.minLevel >= 30)
        ];
        if (allGodly.length > 0) {
            return { type: 'item', item: allGodly[Math.floor(Math.random() * allGodly.length)].name };
        }
    }
    
    if (level >= 10 && roll < 0.2) {
        const allLegendary = [
            ...equipment.weapons.filter(w => w.minLevel >= 10 && w.class === playerClass),
            ...equipment.armor.filter(a => a.minLevel >= 10 && a.class === playerClass),
            ...equipment.helmets.filter(h => h.minLevel >= 10 && (!h.class || h.class === playerClass)),
            ...equipment.gloves.filter(g => g.minLevel >= 10 && (!g.class || g.class === playerClass)),
            ...equipment.boots.filter(b => b.minLevel >= 10 && (!b.class || b.class === playerClass)),
            ...equipment.bracelets.filter(br => br.minLevel >= 10)
        ];
        if (allLegendary.length > 0) {
            return { type: 'item', item: allLegendary[Math.floor(Math.random() * allLegendary.length)].name };
        }
    }
    
    if (roll < 0.60) {
        if (level >= 30 && Math.random() < 0.5) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Godly Health Elixir' : 'Godly Mana Elixir' };
        } else if (level >= 20 && Math.random() < 0.5) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Ultimate Health Potion' : 'Ultimate Mana Potion' };
        } else if (level >= 10 && Math.random() < 0.5) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Supreme Health Potion' : 'Supreme Mana Potion' };
        } else if (level >= 5 && Math.random() < 0.6) {
            return { type: 'item', item: Math.random() < 0.5 ? 'Greater Health Potion' : 'Greater Mana Potion' };
        } else {
            return { type: 'item', item: Math.random() < 0.5 ? 'Large Health Potion' : 'Large Mana Potion' };
        }
    }
    if (roll < 0.70) {
        const levelRings = rings.filter(r => !r.minLevel || r.minLevel <= level);
        return { type: 'ring', item: levelRings[Math.floor(Math.random() * levelRings.length)].name };
    }
    if (roll < 0.80) {
        const levelAmulets = amulets.filter(a => !a.minLevel || a.minLevel <= level);
        return { type: 'amulet', item: levelAmulets[Math.floor(Math.random() * levelAmulets.length)].name };
    }
    
    return { type: 'gold', amount: Math.floor(Math.random() * 15) + (5 * level) };
}

function determineTreasure() {
    const treasure = treasures[Math.floor(Math.random() * treasures.length)];
    const level = game.dungeon.currentLevel;
    return { ...treasure, value: treasure.value * level };
}

function searchRoom() {
    const room = game.currentRoom;
    
    if (room.searched) {
        speak('You already searched this room thoroughly.');
        return;
    }
    
    room.searched = true;
    
    if (game.dungeon.hasSecretRoom && !game.dungeon.secretRoom && Math.random() < 0.15) {
        game.dungeon.secretRoom = true;
        speakSequence([
            'You found a hidden passage behind a loose stone!',
            'Inside, ancient treasures await!'
        ]);
        game.player.inventory.push('Ring of Minor Mana', 'Large Health Potion', 'Amulet of Vitality');
        game.player.gold += 30 * game.dungeon.currentLevel;
    } else {
        const loot = determineLoot();
        if (loot.type === 'gold') {
            game.player.gold += loot.amount;
            speak(`You found ${loot.amount} gold hidden in the shadows.`);
        } else if (loot.type === 'item') {
            game.player.inventory.push(loot.item);
            autoManageInventory(loot.item);
            speak(`You found a hidden ${loot.item}!`);
        } else if (loot.type === 'ring') {
            game.player.inventory.push(loot.item);
            autoManageInventory(loot.item);
            speak(`You found a mystical ${loot.item}! Say 'wear ring' to equip it.`);
        } else if (loot.type === 'amulet') {
            game.player.inventory.push(loot.item);
            autoManageInventory(loot.item);
            speak(`You found a powerful ${loot.item}! Say 'equip amulet' to wear it.`);
        } else {
            speak('You search carefully but find nothing of value.');
        }
    }
}

function openChest() {
    const room = game.currentRoom;
    
    if (!room.hasChest) {
        speak('There is no chest here.');
        return;
    }
    
    if (room.searched) {
        speak('The chest is empty. You already looted it.');
        return;
    }
    
    room.searched = true;
    
    if (Math.random() < 0.08) {
        const mimicDamage = 30 + (game.dungeon.currentLevel * 10);
        game.player.health -= mimicDamage;
        
        speak(`The chest springs to life! It's a mimic! You take ${mimicDamage} damage! Health: ${game.player.health}.`, () => {
            if (game.player.health <= 0) {
                setTimeout(() => gameOver(), 1000);
            } else {
                const mimic = scaleEnemyForLevel({ name: 'Mimic', health: 45, damage: 12, gold: 15, exp: 25, fleeChance: 0.5 }, game.dungeon.currentLevel);
                setTimeout(() => startCombat(mimic), 1000);
            }
        });
    } else {
        let messages = ['You open the ornate chest and discover:'];
        
        if (room.type === 'treasure') {
            const treasure1 = determineTreasure();
            const treasure2 = determineTreasure();
            game.player.gold += treasure1.value;
            game.player.gold += treasure2.value;
            game.player.inventory.push(treasure1.name, treasure2.name);
            autoManageInventory(treasure1.name);
            autoManageInventory(treasure2.name);
            messages.push(`${treasure1.name} worth ${treasure1.value} gold!`);
            messages.push(`${treasure2.name} worth ${treasure2.value} gold!`);
        } else {
            const loot1 = determineLoot();
            const loot2 = determineLoot();
            
            [loot1, loot2].forEach(loot => {
                if (loot.type === 'gold') {
                    game.player.gold += loot.amount;
                    messages.push(`${loot.amount} gold.`);
                } else {
                    game.player.inventory.push(loot.item);
                    autoManageInventory(loot.item);
                    messages.push(`A ${loot.item}.`);
                }
            });
        }
        
        if (Math.random() < 0.25) {
            const availableAbilities = abilities.filter(a => 
                a.class === game.player.class && 
                !game.player.learnedAbilities.includes(a.name) &&
                !game.player.inventory.includes(a.name) &&
                (!a.minLevel || a.minLevel <= game.dungeon.currentLevel)
            );
            
            if (availableAbilities.length > 0) {
                const ability = availableAbilities[Math.floor(Math.random() * availableAbilities.length)];
                game.player.inventory.push(ability.name);
                messages.push(`A ${ability.name} book! Say "read book" to learn it.`);
            }
        }

        speakSequence(messages);
    }
}

// ============================================
// POTIONS
// ============================================

function processPotionCommand(command) {
    let potionType = null;
    for (let potion of potionNames) {
        if (command.includes(potion.toLowerCase()) || 
            (potion.includes('Health') && (command.includes('health') || command.includes('heal'))) ||
            (potion.includes('Mana') && command.includes('mana'))) {
            if (game.player.inventory.includes(potion)) {
                potionType = potion;
                break;
            }
        }
    }
    
    if (!potionType) {
        const availablePotions = game.player.inventory.filter(item => potionNames.includes(item));
        if (availablePotions.length === 0) {
            speak('You have no potions.');
        } else {
            speak(`Available potions: ${availablePotions.join(', ')}. Say which potion to use.`);
        }
        return;
    }
    
    const index = game.player.inventory.indexOf(potionType);
    game.player.inventory.splice(index, 1);
    
    const potionEffects = {
        'Large Health Potion': { heal: 50 },
        'Greater Health Potion': { heal: 100 },
        'Supreme Health Potion': { heal: 300 },
        'Ultimate Health Potion': { heal: 800 },
        'Godly Health Elixir': { heal: 2000 },
        'Large Mana Potion': { mana: 30 },
        'Greater Mana Potion': { mana: 75 },
        'Supreme Mana Potion': { mana: 200 },
        'Ultimate Mana Potion': { mana: 500 },
        'Godly Mana Elixir': { mana: 1500 }
    };
    
    if (potionEffects[potionType]) {
        const effect = potionEffects[potionType];
        if (effect.heal) {
            const oldHealth = game.player.health;
            game.player.health = Math.min(game.player.maxHealth, game.player.health + effect.heal);
            const actualHeal = game.player.health - oldHealth;
            speak(`You drink ${potionType} and restore ${actualHeal} health. Health: ${game.player.health}.`, () => {
                if (game.combat) setTimeout(() => enemyTurn(), 1000);
            });
        } else if (effect.mana) {
            const oldMana = game.player.mana;
            game.player.mana = Math.min(game.player.maxMana, game.player.mana + effect.mana);
            const actualRestore = game.player.mana - oldMana;
            speak(`You drink ${potionType} and restore ${actualRestore} mana. Mana: ${game.player.mana}.`, () => {
                if (game.combat) setTimeout(() => enemyTurn(), 1000);
            });
        }
    } else if (potionType === 'Elixir of Immortality') {
        game.player.activeEffects.push({ type: 'revive', uses: 1 });
        speak(`You drink the Elixir of Immortality! You will revive once if you die.`, () => {
            if (game.combat) setTimeout(() => enemyTurn(), 1000);
        });
    } else if (potionType === 'Potion of Giant Strength') {
        game.player.activeEffects.push({ type: 'strength', battles: 3 });
        speak(`You drink the Potion of Giant Strength! Double damage for 3 battles!`, () => {
            if (game.combat) setTimeout(() => enemyTurn(), 1000);
        });
    } else if (potionType === 'Elixir of Clarity') {
        game.player.activeEffects.push({ type: 'clarity', battles: 3 });
        speak(`You drink the Elixir of Clarity! Spells cost 50% less mana for 3 battles!`, () => {
            if (game.combat) setTimeout(() => enemyTurn(), 1000);
        });
    }
}

// ============================================
// ABILITIES AND SPELLS
// ============================================

function readBook(command) {
    const abilityBooks = game.player.inventory.filter(item => abilities.some(a => a.name === item));
    
    if (abilityBooks.length === 0) {
        speak('You have no ability books to read.');
        return;
    }
    
    let bookToRead = null;
    for (let book of abilityBooks) {
        if (command.includes(book.toLowerCase())) {
            bookToRead = book;
            break;
        }
    }
    
    if (!bookToRead) {
        speak(`Available books: ${abilityBooks.join(', ')}. Say which book to read.`);
        return;
    }
    
    readBookDirect(bookToRead);
}

function readBookDirect(bookName) {
    const abilityData = abilities.find(a => a.name === bookName);
    
    if (!abilityData) {
        speak('This is not an ability book.');
        return;
    }
    
    if (abilityData.class !== game.player.class) {
        speak(`${bookName} is not for your class.`);
        return;
    }
    
    if (game.player.learnedAbilities.includes(bookName)) {
        speak(`You already know ${bookName}.`);
        return;
    }
    
    if (abilityData.minLevel && game.dungeon.currentLevel < abilityData.minLevel) {
        speak(`${bookName} requires dungeon level ${abilityData.minLevel}.`);
        return;
    }
    
    const index = game.player.inventory.indexOf(bookName);
    if (index !== -1) game.player.inventory.splice(index, 1);
    
    game.player.learnedAbilities.push(bookName);
    speak(`You learned ${bookName}! ${abilityData.description}. Damage: ${abilityData.damage}. Cost: ${abilityData.cost} mana.`);
}

function castSpell(command) {
    if (!game.combat) {
        speak('You can only cast spells in combat.');
        return;
    }

    let spellToCast = null;
    for (let ability of abilities) {
        if (command.includes(ability.name.toLowerCase()) && game.player.learnedAbilities.includes(ability.name)) {
            spellToCast = ability;
            break;
        }
    }

    if (!spellToCast) {
        const learned = game.player.learnedAbilities.join(', ');
        if (learned) {
            speak(`You know: ${learned}. Say which spell to cast.`);
        } else {
            speak('You have not learned any spells yet. Find ability books in chests.');
        }
        return;
    }

    let spellCost = getScaledAbilityCost(spellToCast.cost, game.dungeon.currentLevel);
    const clarityEffect = game.player.activeEffects.find(e => e.type === 'clarity');
    if (clarityEffect) {
        spellCost = Math.floor(spellCost * 0.5);
    }

    if (game.player.mana < spellCost) {
        speak(`Not enough mana. You need ${spellCost} mana.`);
        return;
    }

    game.player.mana -= spellCost;
    let levelBonus = game.player.class === 'mage' ? game.player.level * 6 : game.player.level * 5;
    let damage = getScaledAbilityDamage(spellToCast.damage, game.dungeon.currentLevel) + levelBonus;

    // Apply shoulder bonus
    if (game.player.equippedShoulderItem) {
        const shoulderData = equipment.shoulderItems.find(s => s.name === game.player.equippedShoulderItem);
        if (shoulderData) {
            if (shoulderData.effect === 'mage_spell' && game.player.class === 'mage') {
                damage = Math.floor(damage * (1 + shoulderData.bonus));
            } else if (shoulderData.effect === 'rogue_stealth' && spellToCast.type === 'sneak') {
                damage = Math.floor(damage * (1 + shoulderData.bonus));
            }
        }
    }

    game.combat.enemy.health -= damage;
    
    // Handle special spell effects
    if (spellToCast.type === 'freeze') {
        game.combat.enemy.frozen = true;
    } else if (spellToCast.type === 'stun') {
        game.combat.enemy.stunned = true;
    } else if (spellToCast.type === 'poison') {
        game.combat.enemy.poisoned = { damage: 15 + Math.floor(game.player.level * 1.5), duration: spellToCast.duration };
    } else if (spellToCast.type === 'timestop') {
        game.combat.enemy.frozen = true;
        game.combat.enemy.timestopTurns = 2;
        if (game.combat.secondEnemy) {
            game.combat.secondEnemy.frozen = true;
            game.combat.secondEnemy.timestopTurns = 2;
        }
    } else if (spellToCast.type === 'vanish') {
        game.combat.playerShadowmelded = true;
    } else if (spellToCast.type === 'mark') {
        game.combat.enemy.deathMarked = true;
    } else if (spellToCast.type === 'aoe' && game.combat.secondEnemy) {
        game.combat.secondEnemy.health -= damage;
    }

    speakSequence([
        `You cast ${spellToCast.name}!`,
        `${damage} damage!`,
        `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
    ], () => {
        if (game.combat.enemy.health <= 0) {
            if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
                game.combat.enemy = game.combat.secondEnemy;
                game.combat.secondEnemy = null;
                speak(`${game.combat.enemy.name} remains!`, () => {
                    if (spellToCast.type !== 'sneak' && spellToCast.type !== 'vanish' && spellToCast.type !== 'timestop') {
                        setTimeout(() => enemyTurn(), 1000);
                    } else {
                        speak('What will you do?');
                    }
                });
            } else {
                setTimeout(() => combatVictory(), 1000);
            }
        } else if (spellToCast.type !== 'sneak' && spellToCast.type !== 'vanish' && spellToCast.type !== 'timestop') {
            setTimeout(() => enemyTurn(), 1000);
        } else {
            speak('What will you do?');
        }
    });
}

function meditate() {
    if (game.combat) {
        speak('You cannot meditate during combat!');
        return;
    }
    
    if (game.player.mana === game.player.maxMana) {
        speak('You are already at full mana.');
        return;
    }
    
    const tier = Math.floor(game.dungeon.currentLevel / 10);
    const baseRestore = 25;
    const manaRestored = baseRestore * Math.pow(2, tier);
    const previousMana = game.player.mana;
    
    game.player.mana = Math.min(game.player.maxMana, game.player.mana + manaRestored);
    const actualRestored = game.player.mana - previousMana;

    speak(`You meditate and restore ${actualRestored} mana. Current mana: ${game.player.mana}.`);
}

// ============================================
// INFO COMMANDS
// ============================================

function characterStatus() {
    const classData = classes[game.player.class];
    const special = classData.special;
    const expNeeded = game.player.experienceToNext - game.player.experience;

    let messages = [
        `Level ${game.player.level} ${classData.name}.`,
        `Health: ${game.player.health} of ${game.player.maxHealth}.`,
        `Mana: ${game.player.mana} of ${game.player.maxMana}.`,
        `Attack: ${game.player.baseAttack}. Defense: ${game.player.defense}.`
    ];

    if (game.player.weapon) messages.push(`Weapon: ${game.player.weapon}.`);
    if (game.player.armor) messages.push(`Armor: ${game.player.armor}.`);
    if (game.player.shield) messages.push(`Shield: ${game.player.shield}.`);
    if (game.player.helmet) messages.push(`Helmet: ${game.player.helmet}.`);
    if (game.player.gloves) messages.push(`Gloves: ${game.player.gloves}.`);
    if (game.player.boots) messages.push(`Boots: ${game.player.boots}.`);
    if (game.player.equippedShoulderItem) messages.push(`Shoulder: ${game.player.equippedShoulderItem}.`);
    
    if (game.player.equippedBracelets.length > 0) {
        messages.push(`Bracelets: ${game.player.equippedBracelets.join(', ')}.`);
    }

    messages.push(`Experience: ${game.player.experience}. Need ${expNeeded} for next level.`);
    messages.push(`Special ability: ${special.name}. Costs ${special.cost} mana.`);
    messages.push(`Gold: ${game.player.gold}.`);

    if (game.player.learnedAbilities.length > 0) {
        messages.push(`Learned abilities: ${game.player.learnedAbilities.join(', ')}.`);
    }

    if (game.player.equippedRings.length > 0) {
        const uniqueRings = [...new Set(game.player.equippedRings)];
        messages.push(`Equipped rings: ${uniqueRings.join(', ')}.`);
    }

    if (game.player.equippedAmulet) {
        messages.push(`Equipped amulet: ${game.player.equippedAmulet}.`);
    }

    speakSequence(messages);
}

function listInventory() {
    if (game.player.inventory.length === 0) {
        speak(`Empty inventory. Gold: ${game.player.gold}.`);
        return;
    }
    
    const messages = ['Inventory:'];
    
    // Count items
    const itemCounts = {};
    game.player.inventory.forEach(item => {
        itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
    
    // Group by type
    const potions = game.player.inventory.filter(i => potionNames.includes(i));
    const ringsList = game.player.inventory.filter(i => rings.some(r => r.name === i));
    const amuletsList = game.player.inventory.filter(i => amulets.some(a => a.name === i));
    const abilityBooks = game.player.inventory.filter(i => abilities.some(a => a.name === i));
    
    if (potions.length > 0) {
        const potionCounts = {};
        potions.forEach(p => potionCounts[p] = (potionCounts[p] || 0) + 1);
        Object.entries(potionCounts).forEach(([name, count]) => {
            messages.push(`${count} ${name}${count > 1 ? 's' : ''}.`);
        });
    }
    
    if (abilityBooks.length > 0) {
        messages.push(`Books: ${[...new Set(abilityBooks)].join(', ')}.`);
    }
    
    if (ringsList.length > 0) {
        messages.push(`Rings in bag: ${[...new Set(ringsList)].join(', ')}.`);
    }
    
    if (amuletsList.length > 0) {
        messages.push(`Amulets in bag: ${[...new Set(amuletsList)].join(', ')}.`);
    }
    
    const otherItems = game.player.inventory.filter(i => 
        !potionNames.includes(i) && !rings.some(r => r.name === i) && 
        !amulets.some(a => a.name === i) && !abilities.some(ab => ab.name === i)
    );
    if (otherItems.length > 0) {
        messages.push(`Equipment: ${[...new Set(otherItems)].join(', ')}.`);
    }
    
    messages.push(`Gold: ${game.player.gold}.`);
    
    speakSequence(messages);
}

function showHelp() {
    if (game.phase === 'combat') {
        speak('Combat commands: attack, defend, special, cast spell, use potion, or flee.');
    } else {
        speak('Commands: north, south, east, west, look, search, open chest, drink fountain, merchant, meditate, wear ring, remove ring, equip bracelet, remove bracelet, equip amulet, read book, use potion, status, inventory, view junk, save game, load game, help.');
    }
}

function giveHint() {
    if (game.phase === 'combat') {
        if (game.player.health < 30) {
            speak('Your health is low. Consider using a health potion or defending.');
        } else if (game.player.mana >= classes[game.player.class].special.cost) {
            speak(`You have enough mana for ${classes[game.player.class].special.name}.`);
        } else {
            speak('Try attacking or defending based on your health.');
        }
    } else {
        const room = game.currentRoom;
        if (room.type === 'stairs') {
            speak('Stairs here. Say "go down stairs" to descend.');
        } else if (room.type === 'merchant') {
            speak('A merchant is here. Say "merchant" to trade.');
        } else if (room.type === 'fountain' && !room.fountainUsed) {
            speak('A fountain is here. Say "drink fountain" for full healing.');
        } else if (room.hasChest && !room.searched) {
            speak('There is a chest here. Say open chest.');
        } else {
            speak('Explore! The boss is in the far southeast corner.');
        }
    }
}

// ============================================
// SAVE / LOAD
// ============================================

function saveGame() {
    const saveData = {
        player: game.player,
        dungeon: {
            grid: game.dungeon.grid,
            currentLevel: game.dungeon.currentLevel,
            size: game.dungeon.size,
            hasSecretRoom: game.dungeon.hasSecretRoom
        }
    };
    const saveStr = JSON.stringify(saveData);
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem(`echoDungeon_${pin}`, saveStr);
    const spokenPin = pin.split('').join(' ');
    speak(`Game saved! Your PIN is ${spokenPin}. Say "load game" then "code ${spokenPin}" to load.`);
}

function loadGame(pin) {
    try {
        const saveStr = localStorage.getItem(`echoDungeon_${pin}`);
        if (!saveStr) {
            speak(`No game found for PIN ${pin.split('').join(' ')}.`);
            return;
        }
        const saveData = JSON.parse(saveStr);
        game.player = saveData.player;
        game.dungeon.grid = saveData.dungeon.grid;
        game.dungeon.currentLevel = saveData.dungeon.currentLevel;
        game.dungeon.size = saveData.dungeon.size;
        game.dungeon.hasSecretRoom = saveData.dungeon.hasSecretRoom;
        const key = `${game.player.position.x},${game.player.position.y}`;
        game.currentRoom = game.dungeon.grid[key];
        game.initialized = true;
        game.started = true;
        game.needsClass = false;
        game.phase = 'exploration';
        micButton.classList.remove('start-button');
        speak(`Game loaded! Level ${game.player.level} ${classes[game.player.class].name} on Dungeon Level ${game.dungeon.currentLevel}.`, () => {
            describeRoom();
        });
    } catch (e) {
        speak('Error loading game.');
    }
}

// ============================================
// CLASS SELECTION
// ============================================

function selectClass(className) {
    const classData = classes[className];
    game.player.class = className;
    game.player.health = classData.health;
    game.player.maxHealth = classData.maxHealth;
    game.player.mana = classData.mana;
    game.player.maxMana = classData.maxMana;
    game.player.gold = classData.gold;
    game.player.inventory = [...classData.items];
    game.player.equippedRings = [];
    game.player.equippedBracelets = [];
    game.player.learnedAbilities = [];
    game.player.equippedAmulet = '';
    game.player.equippedShoulderItem = '';
    game.player.junkBag = [];
    
    game.player.weapon = classData.items.find(item => equipment.weapons.some(w => w.name === item)) || '';
    game.player.armor = classData.items.find(item => equipment.armor.some(a => a.name === item)) || '';
    game.player.shield = classData.items.find(item => equipment.shields.some(s => s.name === item)) || '';
    game.player.helmet = '';
    game.player.gloves = '';
    game.player.boots = '';
    
    const weaponData = equipment.weapons.find(w => w.name === game.player.weapon);
    game.player.baseAttack = weaponData ? weaponData.attack : 15;
    
    recalculateDefense();
    
    game.needsClass = false;
    game.started = true;
    game.phase = 'exploration';
    
    generateDungeon();
    
    speakSequence([
        `You are now a ${classData.name}.`,
        `Health: ${classData.health}. Mana: ${classData.mana}. Gold: ${classData.gold}.`,
        `Your adventure begins!`
    ], () => {
        setTimeout(() => describeRoom(), 1000);
    });
}

// ============================================
// COMMAND PROCESSING
// ============================================

function processCommand(command) {
    // System commands
    if (command.includes('save game') || command.includes('save')) { 
        saveGame(); 
        return; 
    }
    
    if (command.includes('load game') || command.includes('load')) {
        speak('Say your save PIN after the word "code".');
        game.phase = 'loading';
        return;
    }
    
    if (command.includes('code ') && game.phase === 'loading') {
        const pin = command.split('code ')[1].trim().replace(/\s/g, '');
        loadGame(pin);
        return;
    }

    // Merchant mode
    if (game.merchantOpen) {
        if (command.includes('leave') || command.includes('exit') || command.includes('close')) {
            game.merchantOpen = false;
            speak('You leave the merchant.');
        } else if (command.includes('buy') || command.includes('purchase')) {
            buyFromMerchant(command);
        } else if (command.includes('sell junk') || command.includes('sell all')) {
            sellAllJunk();
        } else if (command.includes('what') || command.includes('wares') || command.includes('stock')) {
            listMerchantWares();
        } else {
            speak('Say buy, sell junk, what do you have, or leave.');
        }
        return;
    }

    // Class selection
    if (game.needsClass) {
        if (command.includes('warrior') || command.includes('fighter')) selectClass('warrior');
        else if (command.includes('mage') || command.includes('wizard')) selectClass('mage'); 
        else if (command.includes('rogue') || command.includes('thief')) selectClass('rogue');
        else speak('Please say warrior, mage, or rogue.');
        return;
    }

    // Combat commands
    if (game.combat) {
        if (command.includes('attack') || command.includes('fight') || command.includes('hit') || command.includes('strike')) playerAttack();
        else if (command.includes('defend') || command.includes('block') || command.includes('guard')) playerDefend();
        else if (command.includes('special') || command.includes('ability')) playerSpecial();
        else if (command.includes('cast') || command.includes('spell')) castSpell(command);
        else if (command.includes('potion') || command.includes('use') || command.includes('drink') || command.includes('heal')) processPotionCommand(command); 
        else if (command.includes('flee') || command.includes('run') || command.includes('escape')) attemptFlee();
        else speak('Say attack, defend, special, cast spell, use potion, or flee.');
        return;
    }

    // Exploration commands
    if (command.includes('status') || command.includes('stats') || command.includes('check')) characterStatus();
    else if (command.includes('inventory') || command.includes('items') || command.includes('bag')) listInventory();
    else if (command.includes('help')) showHelp();
    else if (command.includes('hint')) giveHint();
    else if (command.includes('remove ring') || command.includes('unequip ring')) removeRing(command);
    else if (command.includes('remove bracelet') || command.includes('unequip bracelet')) removeBracelet(command);
    else if (command.includes('potion') || command.includes('use') || command.includes('drink') || command.includes('heal')) processPotionCommand(command); 
    else if (command.includes('north') || command.includes('forward')) move('north');
    else if (command.includes('south') || command.includes('back')) move('south');
    else if (command.includes('east') || command.includes('right')) move('east');
    else if (command.includes('west') || command.includes('left')) move('west');
    else if (command.includes('meditate') || command.includes('rest')) meditate(); 
    else if (command.includes('look') || command.includes('around') || command.includes('where')) describeRoom();
    else if (command.includes('search') || command.includes('examine')) searchRoom();
    else if (command.includes('open chest') || command.includes('chest') || command.includes('loot')) openChest();
    else if (command.includes('fountain') || command.includes('drink water')) useFountain();
    else if (command.includes('stairs') || command.includes('go down') || command.includes('descend')) useStairs();
    else if (command.includes('merchant') || command.includes('shop') || command.includes('trade')) talkToMerchant();
    else if (command.includes('wear ring') || command.includes('equip ring') || command.includes('put on ring')) equipRing(command);
    else if (command.includes('equip amulet') || command.includes('wear amulet')) equipAmulet(command);
    else if (command.includes('equip bracelet') || command.includes('wear bracelet')) equipBracelet(command);
    else if (command.includes('equip shoulder') || command.includes('wear shoulder')) equipShoulderItem(command);
    else if (command.includes('equip') || command.includes('wear')) equipItem(command);
    else if (command.includes('read book') || command.includes('read') || command.includes('learn')) readBook(command);
    else if (command.includes('junk') && (command.includes('add') || command.includes('mark'))) addToJunk(command);
    else if (command.includes('junk') && (command.includes('remove') || command.includes('unmark'))) removeFromJunk(command);
    else if (command.includes('view junk') || command.includes('check junk') || command.includes('list junk')) viewJunk();
    else speak('Unknown command. Say help for options.');
}

// ============================================
// INITIALIZATION
// ============================================

function initializeGame() {
    game.initialized = true;
    micButton.classList.remove('start-button');
    speak("Welcome to Echo Dungeon V11! Say 'load game' with your PIN, or choose your class: warrior, mage, or rogue."); 
}

function handleClick() {
    if (!game.initialized) {
        initializeGame();
    } else {
        startListening();
    }
}

// Start on page load
document.addEventListener('DOMContentLoaded', () => {
    checkBrowserSupport();
    setTimeout(() => {
        speak('Echo Dungeon V11 ready. Tap the screen to begin.');
    }, 1000);
});

micButton.addEventListener('contextmenu', (e) => e.preventDefault());

console.log('game-logic3.js loaded - Game ready!');
