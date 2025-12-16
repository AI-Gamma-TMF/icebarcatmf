'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Delete any existing data related to profane words list
    await queryInterface.bulkDelete('global_settings', { key: 'PROFANE_WORDS_LIST' });

    // Insert new profane words list
    const profaneWordsList = JSON.stringify([
        "abuse", "anus", "arse", "ass", "asshole", "bastard", "bitch", "bloody", "bollocks", "boob", "bugger", "bullshit",
        "cock", "crap", "cunt", "damn", "dick", "douche", "dyke", "fag", "faggot", "freak", "fuck", "fucked", "fucker", 
        "fucking", "hell", "homo", "idiot", "jerk", "knob", "lmao", "lmfao", "moron", "motherfucker", "nigga", "nigger", 
        "penis", "piss", "prick", "pussy", "retard", "scrotum", "shit", "shitty", "slut", "spastic", "spunk", "tits", 
        "twat", "vagina", "wanker", "whore", "wtf", "arsehole", "ballsack", "bollock", "buggery", "clit", "coon", "cum", 
        "dildo", "dykey", "fanny", "feck", "felching", "flog", "foreskin", "gash", "humping", "jackass", "knobjockey", 
        "minge", "nobjock", "plonker", "poof", "prat", "smeg", "tosser", "turd", "yob", "banging", "balls", "beaver", 
        "boner", "boobies", "broad", "clunge", "cockhead", "cockmunch", "coonass", "cornhole", "dickbag", "dickhead", 
        "dipshit", "dumbass", "fuckface", "fudgepacker", "gobshite", "jackoff", "jizz", "muff", "nutcase", "nutsack", 
        "pecker", "pissflap", "shitbag", "shithead", "shithouse", "shitstain", "sucka", "titties", "tool", "tosspot", 
        "tranny", "twatwaffle", "wankstain", "arsewipe", "assbag", "assclown", "asshat", "asslick", "asslicker", 
        "assnugget", "buttfuck", "clitface", "clitfuck", "cockfucker", "cocknose", "cockwaffle", "cumslut", "dickface", 
        "dickfucker", "dicksneeze", "douchebag", "douchefag", "fuckbag", "fuckboy", "fuckbrain", "fuckbutt", "fuckdog", 
        "fucknugget", "fuckwit", "jerkass", "jizzface", "jizzmuffin", "shitfuck", "shitgoblin", "shitsucker", "shittits", 
        "shitwhistle", "slutbag", "titfuck", "twatface", "vagface", "wankfucker", "assbandit", "asscock", "assface", 
        "ballbag", "balllick", "bitchass", "blowjob", "bullcrap", "buttlicker", "clitlicker", "cockblock", "cockburger", 
        "cockjockey", "cocksucker", "cumjockey", "cumsniffer", "dicklicker", "dipshit", "douchelord", "fuckass", 
        "fuckbucket", "fuckchop", "fuckhead", "fuckhole", "fucktard", "fuckwad", "fuckwit", "gaylord", "jizzstain", 
        "knobjob", "mofo", "numbnuts", "pricklick", "shitbrain", "shitcunt", "shiteater", "shithead", "slutface", "twatwaffle", 
        "wankface", "wankrag", "wankspanner", "arsebadger", "asslick", "bastardo", "bellend", "blow", "boobhead", "butthead", 
        "chesticles", "clitsucker", "cocksmith", "cockspank", "cuntface", "cuntflap", "dickbreath", "dickbrain", "dicknose", 
        "dickweed", "fuckbreath", "fucknugget", "fuckpuppet", "fuckstain", "fuckstick", "fucktard", "knobjockey", "mangina", 
        "pisshead", "pussyfart", "scumbag", "shitbreath", "shitdick", "shitstain", "shitturd", "slutdick", "vaginahead", 
        "wankshaft", "assgoblin", "bitchtits", "buttfucker", "cumbucket", "fuckstick", "jizzrag", "knobgobbler", "nutsack", 
        "shitweasel", "twatface", "wankbasket", "asscheese", "ballbreath", "cockbender", "cuntlip", "dicklick", "dicknose", 
        "fuckbutt", "fucknugget", "gobshite", "nutsack", "shitfucker", "shittits", "spunkbreath", "twatgoblin", "vagbreath", 
        "vaghead", "wankpuffin", "arseface", "ballbuster", "cockknob", "dickwad", "fuckbag", "fuckbrain", "fucktard", 
        "jizzface", "knobjob", "shitlicker", "slutspanner", "spunkjunkie", "twatbiscuit", "wankrag", "wankspanner"
      ]);

    await queryInterface.bulkInsert(
      {
        tableName: 'global_settings',
        schema: 'public'
      },
      [
        {
          key: 'PROFANE_WORDS_LIST',
          value: profaneWordsList,  // Inserting the JSON stringified list
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the seeding, deleting the profane words entry
    await queryInterface.bulkDelete('GlobalSetting', { key: 'PROFANE_WORDS_LIST' });
  }
};