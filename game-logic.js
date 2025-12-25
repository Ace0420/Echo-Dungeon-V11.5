// Echo Dungeon V11 - Game Logic
// All game functions and mechanics

// ============================================
// UTILITY FUNCTIONS
// ============================================

function displayText(text) {
    textDisplay.innerHTML = text;
}

function checkBrowserSupport() {
    browserSupport.https = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    browserSupport.speechSynthesis = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
    browserSupport.speechRecognition = !!(window.webkitSpeechRecognition || window.SpeechRecognition);
}

function speak(text, callback) {
    displayText(text);
    if (!browserSupport.speechSynthesis) {
        if (callback) setTimeout(callback, 2000);
        return;
    }
    try {
        speechSynthesis.cancel();
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
            utterance.rate = 0.9;
            if (callback) {
                utterance.onend = callback;
                utterance.onerror = callback;
            }
            speechSynthesis.speak(utterance);
        }, 100);
    } catch (error) {
        if (callback) setTimeout(callback, 2000);
    }
}

function speakSequence(messages, callback) {
    if (messages.length === 0) {
        if (callback) callback();
        return;
    }
    const [first, ...rest] = messages;
    speak(first, () => {
        if (rest.length > 0) {
            setTimeout(() => speakSequence(rest, callback), 500);
        } else if (callback) {
            callback();
        }
    });
}

// ============================================
// VOICE RECOGNITION
// ============================================

let recognition = null;

function startListening() {
    if (!browserSupport.speechRecognition || !browserSupport.https) {
        speak('Voice recognition requires HTTPS and a compatible browser like Chrome or Edge.');
        return;
    }
    if (game.listening) { stopListening(); return; }
    try {
        const Recognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognition = new Recognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.onstart = () => {
            game.listening = true;
            micButton.classList.add('listening');
        };
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase().trim();
            displayText(`You said: "${command}"`);
            stopListening();
            setTimeout(() => processCommand(command), 500);
        };
        recognition.onerror = (event) => {
            stopListening();
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                speak('Voice error. Try again.');
            }
        };
        recognition.onend = () => stopListening();
        recognition.start();
    } catch (error) {
        speak('Failed to start voice recognition.');
        stopListening();
    }
}

function stopListening() {
    game.listening = false;
    micButton.classList.remove('listening');
    if (recognition) {
        try { recognition.stop(); } catch (e) {}
        recognition = null;
    }
}

// ============================================
// SCALING FUNCTIONS
// ============================================

function getScalingMultiplier(dungeonLevel) {
    return Math.pow(2, Math.floor(dungeonLevel / 10));
}

function getScaledAbilityDamage(baseDamage, dungeonLevel) {
    return Math.floor(baseDamage * getScalingMultiplier(dungeonLevel));
}

function getScaledAbilityCost(baseCost, dungeonLevel) {
    return Math.floor(baseCost * getScalingMultiplier(dungeonLevel));
}

function scaleEnemyForLevel(enemy, level) {
    const scaleFactor = 1 + ((level - 1) * 0.3);
    return {
        ...enemy,
        health: Math.floor(enemy.health * scaleFactor),
        damage: Math.floor(enemy.damage * scaleFactor),
        gold: Math.floor(enemy.gold * scaleFactor),
        exp: Math.floor(enemy.exp * scaleFactor),
        regenerate: enemy.regenerate
    };
}

// ============================================
// DEFENSE CALCULATION
// ============================================

function recalculateDefense() {
    game.player.defense = 0;
    
    if (game.player.armor) {
        const armorData = equipment.armor.find(a => a.name === game.player.armor) ||
                          merchantItems.find(i => i.name === game.player.armor && i.type === 'armor');
        if (armorData) game.player.defense += armorData.defense;
    }
    
    if (game.player.shield) {
        const shieldData = equipment.shields.find(s => s.name === game.player.shield) ||
                           merchantItems.find(i => i.name === game.player.shield && i.type === 'shield');
        if (shieldData) game.player.defense += shieldData.defense;
    }
    
    if (game.player.helmet) {
        const helmetData = equipment.helmets.find(h => h.name === game.player.helmet) ||
                           merchantItems.find(i => i.name === game.player.helmet && i.type === 'helmet');
        if (helmetData && helmetData.defense) game.player.defense += helmetData.defense;
    }
    
    if (game.player.gloves) {
        const glovesData = equipment.gloves.find(g => g.name === game.player.gloves) ||
                           merchantItems.find(i => i.name === game.player.gloves && i.type === 'gloves');
        if (glovesData && glovesData.defense) game.player.defense += glovesData.defense;
    }
    
    if (game.player.boots) {
        const bootsData = equipment.boots.find(b => b.name === game.player.boots) ||
                          merchantItems.find(i => i.name === game.player.boots && i.type === 'boots');
        if (bootsData && bootsData.defense) game.player.defense += bootsData.defense;
    }
}

// ============================================
// JUNK BAG MANAGEMENT (FIXED)
// ============================================

function isPotion(itemName) {
    return potionNames.includes(itemName);
}

function getItemType(itemName) {
    if (treasures.some(t => t.name === itemName)) return 'treasure';
    if (rings.some(r => r.name === itemName)) return 'ring';
    if (amulets.some(a => a.name === itemName)) return 'amulet';
    if (equipment.bracelets.some(b => b.name === itemName)) return 'bracelet';
    if (equipment.weapons.some(w => w.name === itemName)) return 'weapon';
    if (equipment.armor.some(a => a.name === itemName)) return 'armor';
    if (equipment.shields.some(s => s.name === itemName)) return 'shield';
    if (equipment.helmets.some(h => h.name === itemName)) return 'helmet';
    if (equipment.gloves.some(g => g.name === itemName)) return 'gloves';
    if (equipment.boots.some(b => b.name === itemName)) return 'boots';
    if (equipment.shoulderItems.some(s => s.name === itemName)) return 'shoulder';
    if (merchantItems.some(m => m.name === itemName)) return 'merchant';
    if (abilities.some(a => a.name === itemName)) return 'ability';
    return 'other';
}

function getEquipmentSlot(itemName) {
    if (equipment.weapons.some(w => w.name === itemName) || merchantItems.some(m => m.name === itemName && m.type === 'weapon')) return 'weapon';
    if (equipment.armor.some(a => a.name === itemName) || merchantItems.some(m => m.name === itemName && m.type === 'armor')) return 'armor';
    if (equipment.shields.some(s => s.name === itemName) || merchantItems.some(m => m.name === itemName && m.type === 'shield')) return 'shield';
    if (equipment.helmets.some(h => h.name === itemName) || merchantItems.some(m => m.name === itemName && m.type === 'helmet')) return 'helmet';
    if (equipment.gloves.some(g => g.name === itemName) || merchantItems.some(m => m.name === itemName && m.type === 'gloves')) return 'gloves';
    if (equipment.boots.some(b => b.name === itemName) || merchantItems.some(m => m.name === itemName && m.type === 'boots')) return 'boots';
    if (equipment.shoulderItems.some(s => s.name === itemName)) return 'equippedShoulderItem';
    return null;
}

// FIXED: Auto-manage inventory with proper junk bag rules
function autoManageInventory(newItem) {
    // NEVER junk potions
    if (isPotion(newItem)) return;
    
    const itemType = getItemType(newItem);
    
    // Treasures always go to junk bag
    if (itemType === 'treasure') {
        if (!game.player.junkBag.includes(newItem)) {
            game.player.junkBag.push(newItem);
        }
        const idx = game.player.inventory.indexOf(newItem);
        if (idx !== -1) {
            game.player.inventory.splice(idx, 1);
        }
        return;
    }
    
    // Rings: max 2 of each kind (except Ring of Regeneration - unlimited)
    if (itemType === 'ring') {
        if (newItem === 'Ring of Regeneration') return; // No limit on regen rings
        
        const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
        const equippedCount = game.player.equippedRings.filter(i => i === newItem).length;
        const totalCount = inventoryCount + equippedCount;
        
        if (totalCount > 2) {
            // Move excess to junk
            for (let i = game.player.inventory.length - 1; i >= 0; i--) {
                if (game.player.inventory[i] === newItem) {
                    const currentInvCount = game.player.inventory.filter(x => x === newItem).length;
                    const currentEquipCount = game.player.equippedRings.filter(x => x === newItem).length;
                    if (currentInvCount + currentEquipCount > 2) {
                        game.player.inventory.splice(i, 1);
                        if (!game.player.junkBag.includes(newItem)) {
                            game.player.junkBag.push(newItem);
                        }
                    }
                }
            }
        }
        return;
    }
    
    // Amulets: max 1 of each kind
    if (itemType === 'amulet') {
        const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
        const isEquipped = game.player.equippedAmulet === newItem;
        const totalCount = inventoryCount + (isEquipped ? 1 : 0);
        
        if (totalCount > 1) {
            for (let i = game.player.inventory.length - 1; i >= 0; i--) {
                if (game.player.inventory[i] === newItem) {
                    const currentInvCount = game.player.inventory.filter(x => x === newItem).length;
                    const currentEquip = game.player.equippedAmulet === newItem ? 1 : 0;
                    if (currentInvCount + currentEquip > 1) {
                        game.player.inventory.splice(i, 1);
                        if (!game.player.junkBag.includes(newItem)) {
                            game.player.junkBag.push(newItem);
                        }
                    }
                }
            }
        }
        return;
    }
    
    // Bracelets: max 1 of each kind
    if (itemType === 'bracelet') {
        const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
        const equippedCount = game.player.equippedBracelets.filter(i => i === newItem).length;
        const totalCount = inventoryCount + equippedCount;
        
        if (totalCount > 1) {
            for (let i = game.player.inventory.length - 1; i >= 0; i--) {
                if (game.player.inventory[i] === newItem) {
                    const currentInvCount = game.player.inventory.filter(x => x === newItem).length;
                    const currentEquipCount = game.player.equippedBracelets.filter(x => x === newItem).length;
                    if (currentInvCount + currentEquipCount > 1) {
                        game.player.inventory.splice(i, 1);
                        if (!game.player.junkBag.includes(newItem)) {
                            game.player.junkBag.push(newItem);
                        }
                    }
                }
            }
        }
        return;
    }
    
    // Equipment (weapons, armor, etc): max 1 of each - old equipment goes to junk when replaced
    if (['weapon', 'armor', 'shield', 'helmet', 'gloves', 'boots', 'shoulder'].includes(itemType)) {
        const equipmentSlot = getEquipmentSlot(newItem);
        if (equipmentSlot) {
            const currentEquipped = game.player[equipmentSlot];
            const inventoryCount = game.player.inventory.filter(i => i === newItem).length;
            const isEquipped = currentEquipped === newItem;
            const totalCount = inventoryCount + (isEquipped ? 1 : 0);
            
            if (totalCount > 1) {
                for (let i = game.player.inventory.length - 1; i >= 0; i--) {
                    if (game.player.inventory[i] === newItem) {
                        const currentInvCount = game.player.inventory.filter(x => x === newItem).length;
                        const currentEquip = game.player[equipmentSlot] === newItem ? 1 : 0;
                        if (currentInvCount + currentEquip > 1) {
                            game.player.inventory.splice(i, 1);
                            if (!game.player.junkBag.includes(newItem)) {
                                game.player.junkBag.push(newItem);
                            }
                        }
                    }
                }
            }
        }
    }
}

// ============================================
// COMBAT SYSTEM
// ============================================

function startCombat(enemy, secondEnemy = null) {
    game.combat = { 
        enemy: { ...enemy }, 
        secondEnemy: secondEnemy ? { ...secondEnemy } : null,
        playerDefending: false,
        twoEnemyFight: secondEnemy ? true : false,
        playerShadowmelded: false
    };
    game.phase = 'combat';
    
    let messages = [`Combat begins!`, `${enemy.name} has ${enemy.health} health.`];
    
    if (secondEnemy) {
        messages.push(`${secondEnemy.name} has ${secondEnemy.health} health.`);
        messages.push(`You face two enemies!`);
    }
    
    if (enemy.regenerate) {
        messages.push(`Warning: ${enemy.name} regenerates ${enemy.regenerate} health per turn!`);
    }
    if (secondEnemy && secondEnemy.regenerate) {
        messages.push(`Warning: ${secondEnemy.name} regenerates ${secondEnemy.regenerate} health per turn!`);
    }
    
    messages.push(`What will you do? Attack, defend, special, cast spell, use potion, or flee.`);
    
    speakSequence(messages);
}

// FIXED: Player Attack Function
function playerAttack() {
    if (!game.combat || !game.combat.enemy) {
        speak('You are not in combat.');
        return;
    }
    
    // Get weapon attack value
    const weaponData = equipment.weapons.find(w => w.name === game.player.weapon) ||
                       merchantItems.find(i => i.name === game.player.weapon && i.type === 'weapon');
    const weaponAttack = weaponData ? weaponData.attack : 0;
    
    // Get amulet bonus
    let amuletBonus = 0;
    if (game.player.equippedAmulet) {
        const amuletData = amulets.find(a => a.name === game.player.equippedAmulet);
        if (amuletData && amuletData.stat === 'attack') {
            amuletBonus = amuletData.value;
        }
    }
    
    // Get gloves bonus
    let glovesBonus = 0;
    if (game.player.gloves) {
        const glovesData = equipment.gloves.find(g => g.name === game.player.gloves) ||
                           merchantItems.find(i => i.name === game.player.gloves && i.type === 'gloves');
        if (glovesData && glovesData.attack) {
            glovesBonus = glovesData.attack;
        }
    }
    
    // Get bracelet bonus
    let braceletBonus = 0;
    for (let bracelet of game.player.equippedBracelets) {
        const braceletData = equipment.bracelets.find(b => b.name === bracelet) ||
                             merchantItems.find(i => i.name === bracelet && i.type === 'bracelet');
        if (braceletData && braceletData.attack) {
            braceletBonus += braceletData.attack;
        }
    }
    
    // Calculate base damage
    let baseDamage = game.player.baseAttack + weaponAttack + amuletBonus + glovesBonus + braceletBonus;
    
    // Level bonus for warrior/rogue
    if (game.player.class === 'warrior' || game.player.class === 'rogue') {
        baseDamage += (game.player.level - 1) * 5;
    }
    
    // Ring attack bonus
    const ringBonus = game.player.equippedRings.reduce((total, ring) => {
        const ringData = rings.find(r => r.name === ring);
        return total + (ringData && ringData.stat === 'attack' ? ringData.value : 0);
    }, 0);
    
    // Calculate final damage with randomness
    let damage = baseDamage + ringBonus + Math.floor(Math.random() * 10);
    
    // Shoulder item bonus
    if (game.player.equippedShoulderItem) {
        const shoulderData = equipment.shoulderItems.find(s => s.name === game.player.equippedShoulderItem);
        if (shoulderData && shoulderData.effect === 'warrior_damage') {
            damage = Math.floor(damage * (1 + shoulderData.bonus));
        }
    }
    
    // Giant Strength potion effect
    const strengthEffect = game.player.activeEffects.find(e => e.type === 'strength');
    if (strengthEffect) {
        damage = Math.floor(damage * 2);
    }
    
    // Vanish/Shadowmeld bonus
    if (game.combat.playerShadowmelded) {
        damage = Math.floor(damage * 2);
        game.combat.playerShadowmelded = false;
    }
    
    // Death Mark bonus
    if (game.combat.enemy.deathMarked) {
        damage = Math.floor(damage * 1.5);
    }
    
    // Apply damage to enemy
    game.combat.enemy.health -= damage;
    
    let messages = [`You attack for ${damage} damage!`];
    if (strengthEffect) {
        messages.push(`Giant Strength doubles your damage!`);
    }
    if (game.combat.enemy.deathMarked) {
        messages.push(`Death Mark amplifies your strike!`);
    }
    messages.push(`${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`);
    
    speakSequence(messages, () => {
        if (game.combat.enemy.health <= 0) {
            if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
                game.combat.enemy = game.combat.secondEnemy;
                game.combat.secondEnemy = null;
                speak(`${game.combat.enemy.name} remains! Health: ${game.combat.enemy.health}.`, () => {
                    setTimeout(() => enemyTurn(), 1000);
                });
            } else {
                setTimeout(() => combatVictory(), 1000);
            }
        } else {
            setTimeout(() => enemyTurn(), 1000);
        }
    });
}

function playerDefend() {
    if (!game.combat) {
        speak('You are not in combat.');
        return;
    }
    game.combat.playerDefending = true;
    speak('You brace for impact.', () => {
        setTimeout(() => enemyTurn(), 1000);
    });
}

function playerSpecial() {
    if (!game.combat) {
        speak('You are not in combat.');
        return;
    }
    
    const classData = classes[game.player.class];
    const special = classData.special;
    
    const scaledCost = getScaledAbilityCost(special.cost, game.dungeon.currentLevel);
    
    if (game.player.mana < scaledCost) {
        speak(`Not enough mana. You need ${scaledCost}.`);
        return;
    }
    
    game.player.mana -= scaledCost;
    
    if (special.type === 'damage') {
        let damage = getScaledAbilityDamage(special.damage, game.dungeon.currentLevel);
        
        if (game.player.class === 'warrior' || game.player.class === 'rogue') {
            damage += (game.player.level - 1) * 5;
        } else if (game.player.class === 'mage') {
            damage += (game.player.level - 1) * 6;
        }
        
        game.combat.enemy.health -= damage;
        
        speakSequence([
            `You unleash ${special.name}!`,
            `${damage} damage!`,
            `${game.combat.enemy.name} has ${Math.max(0, game.combat.enemy.health)} health left.`
        ], () => {
            if (game.combat.enemy.health <= 0) {
                if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
                    game.combat.enemy = game.combat.secondEnemy;
                    game.combat.secondEnemy = null;
                    speak(`${game.combat.enemy.name} remains! Health: ${game.combat.enemy.health}.`, () => {
                        setTimeout(() => enemyTurn(), 1000);
                    });
                } else {
                    setTimeout(() => combatVictory(), 1000);
                }
            } else {
                setTimeout(() => enemyTurn(), 1000);
            }
        });
    }
}

function attemptFlee() {
    if (!game.combat) {
        speak('You are not in combat.');
        return;
    }
    
    const chance = game.combat.enemy.fleeChance;
    const roll = Math.random();
    
    speak(`Attempting to flee...`, () => {
        setTimeout(() => {
            if (roll < chance) {
                speak('You successfully escape!', () => {
                    game.combat = null;
                    game.phase = 'exploration';
                    setTimeout(() => {
                        const centerX = 6;
                        const centerY = 6;
                        game.player.position = { x: centerX, y: centerY };
                        const key = `${centerX},${centerY}`;
                        game.currentRoom = game.dungeon.grid[key];
                        speak('You flee back to the entrance.');
                    }, 1000);
                });
            } else {
                speak('You fail to escape!', () => {
                    setTimeout(() => enemyTurn(), 1000);
                });
            }
        }, 1000);
    });
}

function enemyTurn() {
    if (!game.combat) return;
    
    let messages = [];
    
    // Player ring regeneration
    const regenRingCount = game.player.equippedRings.filter(r => r === 'Ring of Regeneration').length;
    if (regenRingCount > 0) {
        const regenAmount = 50 * regenRingCount;
        const oldHealth = game.player.health;
        game.player.health = Math.min(game.player.maxHealth, game.player.health + regenAmount);
        const actualHeal = game.player.health - oldHealth;
        if (actualHeal > 0) {
            messages.push(`Your Ring${regenRingCount > 1 ? 's' : ''} of Regeneration heal${regenRingCount === 1 ? 's' : ''} you for ${actualHeal} health!`);
        }
    }
    
    // Check if enemy is frozen
    if (game.combat.enemy.frozen) {
        if (game.combat.enemy.timestopTurns) {
            game.combat.enemy.timestopTurns--;
            if (game.combat.enemy.timestopTurns <= 0) {
                game.combat.enemy.frozen = false;
                game.combat.enemy.timestopTurns = 0;
            }
        } else {
            game.combat.enemy.frozen = false;
        }
        messages.push(`${game.combat.enemy.name} is frozen and cannot act!`);
    } else if (game.combat.enemy.stunned) {
        messages.push(`${game.combat.enemy.name} is stunned and cannot act!`);
        game.combat.enemy.stunned = false;
    } else {
        // Enemy regeneration
        if (game.combat.enemy.regenerate) {
            game.combat.enemy.health += game.combat.enemy.regenerate;
            messages.push(`${game.combat.enemy.name} regenerates ${game.combat.enemy.regenerate} health!`);
        }
        
        // Poison damage
        if (game.combat.enemy.poisoned) {
            game.combat.enemy.health -= game.combat.enemy.poisoned.damage;
            messages.push(`${game.combat.enemy.name} takes ${game.combat.enemy.poisoned.damage} poison damage!`);
            game.combat.enemy.poisoned.duration--;
            if (game.combat.enemy.poisoned.duration <= 0) {
                game.combat.enemy.poisoned = null;
            }
            if (game.combat.enemy.health <= 0) {
                speakSequence(messages, () => {
                    setTimeout(() => {
                        if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
                            game.combat.enemy = game.combat.secondEnemy;
                            game.combat.secondEnemy = null;
                            speak(`${game.combat.enemy.name} remains! Health: ${game.combat.enemy.health}.`);
                        } else {
                            combatVictory();
                        }
                    }, 1000);
                });
                return;
            }
        }
        
        // Enemy attack
        let damage = game.combat.enemy.damage;
        
        if (game.combat.playerDefending) {
            damage = Math.floor(damage * 0.5);
            game.combat.playerDefending = false;
        }
        
        const reducedDamage = Math.max(1, damage - game.player.defense);
        game.player.health -= reducedDamage;
        
        messages.push(`${game.combat.enemy.name} attacks for ${reducedDamage} damage!`);
    }
    
    // Second enemy attack
    if (game.combat.secondEnemy && game.combat.secondEnemy.health > 0) {
        if (game.combat.secondEnemy.frozen) {
            if (game.combat.secondEnemy.timestopTurns) {
                game.combat.secondEnemy.timestopTurns--;
                if (game.combat.secondEnemy.timestopTurns <= 0) {
                    game.combat.secondEnemy.frozen = false;
                    game.combat.secondEnemy.timestopTurns = 0;
                }
            } else {
                game.combat.secondEnemy.frozen = false;
            }
            messages.push(`${game.combat.secondEnemy.name} is frozen and cannot act!`);
        } else {
            if (game.combat.secondEnemy.regenerate) {
                game.combat.secondEnemy.health += game.combat.secondEnemy.regenerate;
                messages.push(`${game.combat.secondEnemy.name} regenerates ${game.combat.secondEnemy.regenerate} health!`);
            }
            
            let damage2 = game.combat.secondEnemy.damage;
            const reducedDamage2 = Math.max(1, damage2 - game.player.defense);
            game.player.health -= reducedDamage2;
            messages.push(`${game.combat.secondEnemy.name} attacks for ${reducedDamage2} damage!`);
        }
    }
    
    messages.push(`Your health: ${Math.max(0, game.player.health)}.`);
    
    speakSequence(messages, () => {
        if (game.player.health <= 0) {
            setTimeout(() => gameOver(), 1000);
        } else {
            setTimeout(() => speak('What will you do?'), 500);
        }
    });
}

function combatVictory() {
    let gold = game.combat.enemy.gold;
    let exp = game.combat.enemy.exp;
    
    if (game.player.specialItems.includes('Golden Fortune Coin')) {
        gold = Math.floor(gold * 1.5);
    }
    
    const wasTwoEnemyFight = game.combat.twoEnemyFight || false;
    
    if (wasTwoEnemyFight) {
        exp = exp * 2;
    }
    
    game.player.gold += gold;
    
    if (game.currentRoom.enemy) {
        game.currentRoom.enemy.health = 0;
    }
    if (game.currentRoom.secondEnemy) {
        game.currentRoom.secondEnemy.health = 0;
    }
    
    const messages = [
        `${game.combat.enemy.name} defeated!`,
        `You gain ${gold} gold and ${exp} experience!`
    ];
    if (wasTwoEnemyFight) {
        messages.push(`Double experience for defeating 2 enemies!`);
    }
    
    // Check active effects
    const strengthEffect = game.player.activeEffects.find(e => e.type === 'strength');
    if (strengthEffect) {
        strengthEffect.battles--;
        if (strengthEffect.battles <= 0) {
            game.player.activeEffects = game.player.activeEffects.filter(e => e.type !== 'strength');
            messages.push(`Giant Strength effect has worn off.`);
        }
    }
    
    const clarityEffect = game.player.activeEffects.find(e => e.type === 'clarity');
    if (clarityEffect) {
        clarityEffect.battles--;
        if (clarityEffect.battles <= 0) {
            game.player.activeEffects = game.player.activeEffects.filter(e => e.type !== 'clarity');
            messages.push(`Clarity effect has worn off.`);
        }
    }
    
    speakSequence(messages, () => {
        game.combat = null;
        game.phase = 'exploration';
        gainExperience(exp);
        
        if (game.currentRoom.type === 'boss') {
            setTimeout(() => dungeonComplete(), 1500);
        } else {
            setTimeout(() => speak('What will you do next?'), 1000);
        }
    });
}

function dungeonComplete() {
    speakSequence([
        'You defeated the boss!',
        'The dungeon level is cleared!',
        'Seek the stairs to descend deeper!',
        `You are now level ${game.player.level} with ${game.player.gold} gold.`
    ]);
}

function gameOver() {
    const reviveEffect = game.player.activeEffects.find(e => e.type === 'revive');
    if (reviveEffect && reviveEffect.uses > 0) {
        reviveEffect.uses--;
        game.player.activeEffects = game.player.activeEffects.filter(e => e.type !== 'revive');
        game.player.health = Math.floor(game.player.maxHealth * 0.5);
        
        speakSequence([
            'You have fallen!',
            'But the Elixir of Immortality revives you!',
            `You return with ${game.player.health} health!`,
            'What will you do?'
        ]);
        return;
    }
    
    speakSequence([
        'You have been defeated.',
        'Your adventure ends here.',
        `You reached level ${game.player.level} and collected ${game.player.gold} gold.`,
        'Game over. Refresh to play again.'
    ]);
}

// ============================================
// EXPERIENCE AND LEVELING
// ============================================

function gainExperience(exp) {
    let actualExp = exp;
    
    if (game.player.equippedAmulet && amulets.find(a => a.name === game.player.equippedAmulet)?.stat === 'expGain') {
        actualExp = Math.floor(exp * 1.2);
    }
    
    if (game.player.specialItems.includes('Ancient Knowledge Crystal')) {
        actualExp = Math.floor(actualExp * 2);
    }
    
    game.player.experience += actualExp;
    
    if (game.player.experience >= game.player.experienceToNext) {
        levelUp();
    }
}

function levelUp() {
    game.player.level++;
    game.player.experience -= game.player.experienceToNext;
    game.player.experienceToNext = Math.floor(game.player.experienceToNext * 1.20);
    
    const tier = Math.floor(game.dungeon.currentLevel / 10);
    const baseHealthGain = 20;
    const baseManaGain = 10;
    const healthGain = baseHealthGain * Math.pow(2, tier);
    const manaGain = baseManaGain * Math.pow(2, tier);
    
    game.player.maxHealth += healthGain;
    game.player.health = game.player.maxHealth;
    game.player.maxMana += manaGain;
    game.player.mana = game.player.maxMana;
    
    speakSequence([
        `Level up! You are now level ${game.player.level}!`,
        `Max health increased by ${healthGain}!`,
        `Max mana increased by ${manaGain}!`,
        `Fully healed and restored!`
    ]);
}

console.log('game-logic.js part 1 loaded');
