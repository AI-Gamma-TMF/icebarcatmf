'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for SEO Management sections:
// - Dynamic Blog Post (GET /api/v1/blog-post) -> blog_post + faq tables
// - Dynamic Game Pages (GET /api/v1/game-pages) -> game_pages + game_page_cards + game-page-faq tables
// - Image Gallery (GET /api/v1/gallery) -> gallery table
//
// This seeder is idempotent: it checks for existing demo data before inserting.

module.exports = {
  async up (queryInterface) {
    const now = new Date()

    // ========================================
    // 1. Dynamic Blog Posts
    // ========================================
    const existingBlogPosts = await queryInterface.sequelize.query(
      `SELECT blog_post_id AS "id" FROM blog_post WHERE meta_title LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    let blogPostIds = []
    if (existingBlogPosts.length === 0) {
      const blogPosts = [
        {
          meta_title: 'Demo: Ultimate Guide to Online Slots',
          meta_description: 'Discover the best strategies and tips for playing online slots. Learn about RTP, volatility, and bonus features.',
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Ultimate Guide to Online Slots',
            author: { '@type': 'Organization', name: 'GammaSweep' }
          }),
          slug: 'demo-ultimate-guide-online-slots',
          post_heading: 'The Ultimate Guide to Online Slots in 2026',
          banner_image_url: 'https://placehold.co/1200x400/1a1a2e/00ff88?text=Slots+Guide',
          banner_image_alt: 'Online Slots Guide Banner',
          content_body: `<h2>Introduction to Online Slots</h2>
<p>Online slots have become one of the most popular forms of entertainment in the gaming world. With thousands of titles available, there's something for everyone.</p>

<h2>Understanding RTP and Volatility</h2>
<p>Return to Player (RTP) is a crucial metric that tells you the theoretical percentage of wagered money a slot will pay back over time. High RTP slots typically offer 96% or higher.</p>

<h3>Volatility Explained</h3>
<ul>
<li><strong>Low Volatility:</strong> Frequent small wins</li>
<li><strong>Medium Volatility:</strong> Balanced gameplay</li>
<li><strong>High Volatility:</strong> Rare but larger wins</li>
</ul>

<h2>Popular Slot Features</h2>
<p>Modern slots come packed with exciting features like free spins, multipliers, wild symbols, and bonus rounds that can significantly boost your winnings.</p>`,
          is_popular_blog: true,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          meta_title: 'Demo: Blackjack Strategy Guide',
          meta_description: 'Master the art of blackjack with our comprehensive strategy guide. Learn basic strategy, card counting basics, and bankroll management.',
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Blackjack Strategy Guide',
            author: { '@type': 'Organization', name: 'GammaSweep' }
          }),
          slug: 'demo-blackjack-strategy-guide',
          post_heading: 'Master Blackjack: Complete Strategy Guide',
          banner_image_url: 'https://placehold.co/1200x400/2d2d44/ffcc00?text=Blackjack+Strategy',
          banner_image_alt: 'Blackjack Strategy Guide Banner',
          content_body: `<h2>Basic Blackjack Strategy</h2>
<p>Blackjack is one of the few casino games where skill can significantly impact your results. Understanding basic strategy is essential for any serious player.</p>

<h2>When to Hit, Stand, Double, or Split</h2>
<p>The key to blackjack success lies in knowing the optimal play for every possible hand combination.</p>

<h3>Hard Hands</h3>
<p>Always stand on 17 or higher. Hit on 11 or lower. The decisions in between depend on the dealer's upcard.</p>

<h3>Soft Hands</h3>
<p>Soft hands (containing an Ace counted as 11) offer more flexibility and opportunities for doubling down.</p>

<h2>Bankroll Management</h2>
<p>Never bet more than 5% of your bankroll on a single hand. This ensures you can weather losing streaks and stay in the game.</p>`,
          is_popular_blog: true,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          meta_title: 'Demo: Live Casino Experience',
          meta_description: 'Experience the thrill of live dealer games from the comfort of your home. Explore our live casino offerings.',
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Live Casino Experience',
            author: { '@type': 'Organization', name: 'GammaSweep' }
          }),
          slug: 'demo-live-casino-experience',
          post_heading: 'The Ultimate Live Casino Experience',
          banner_image_url: 'https://placehold.co/1200x400/1e3a5f/00ccff?text=Live+Casino',
          banner_image_alt: 'Live Casino Experience Banner',
          content_body: `<h2>What is Live Casino?</h2>
<p>Live casino brings the authentic casino experience directly to your screen. Real dealers, real cards, and real-time interaction create an immersive gaming environment.</p>

<h2>Popular Live Games</h2>
<ul>
<li><strong>Live Blackjack:</strong> Multiple tables with varying limits</li>
<li><strong>Live Roulette:</strong> European, American, and specialty variants</li>
<li><strong>Live Baccarat:</strong> Classic and speed versions</li>
<li><strong>Game Shows:</strong> Exciting TV-style games with big multipliers</li>
</ul>

<h2>Tips for Live Gaming</h2>
<p>Ensure you have a stable internet connection for the best experience. Take advantage of chat features to interact with dealers and other players.</p>`,
          is_popular_blog: false,
          is_active: true,
          created_at: now,
          updated_at: now
        },
        {
          meta_title: 'Demo: Responsible Gaming Guide',
          meta_description: 'Learn about responsible gaming practices and tools available to help you stay in control.',
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Responsible Gaming Guide',
            author: { '@type': 'Organization', name: 'GammaSweep' }
          }),
          slug: 'demo-responsible-gaming-guide',
          post_heading: 'Your Guide to Responsible Gaming',
          banner_image_url: 'https://placehold.co/1200x400/3d1a5f/ff66cc?text=Responsible+Gaming',
          banner_image_alt: 'Responsible Gaming Guide Banner',
          content_body: `<h2>Gaming Should Be Fun</h2>
<p>At GammaSweep, we believe gaming should always be an enjoyable form of entertainment. We're committed to promoting responsible gaming practices.</p>

<h2>Setting Limits</h2>
<p>Use our built-in tools to set deposit limits, session time limits, and loss limits that work for your budget.</p>

<h2>Recognizing Problem Gaming</h2>
<p>If gaming stops being fun or starts affecting other areas of your life, it may be time to take a break. We offer self-exclusion options for players who need them.</p>

<h2>Resources</h2>
<p>We partner with organizations that provide support for problem gaming. Help is always available.</p>`,
          is_popular_blog: false,
          is_active: true,
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('blog_post', blogPosts, {})
      console.log(`Inserted ${blogPosts.length} demo blog posts`)

      // Get inserted blog post IDs
      const insertedPosts = await queryInterface.sequelize.query(
        `SELECT blog_post_id AS "id" FROM blog_post WHERE meta_title LIKE 'Demo:%' ORDER BY blog_post_id;`,
        { type: QueryTypes.SELECT }
      )
      blogPostIds = insertedPosts.map(p => p.id)

      // Add FAQs for blog posts
      const blogFaqs = []
      const faqData = [
        { q: 'What is RTP in slots?', a: 'RTP (Return to Player) is the theoretical percentage of wagered money that a slot machine will pay back to players over time.' },
        { q: 'Are online slots fair?', a: 'Yes, reputable online casinos use Random Number Generators (RNG) that are regularly audited to ensure fair play.' },
        { q: 'What is basic blackjack strategy?', a: 'Basic strategy is a mathematically optimal way to play every possible hand in blackjack based on your cards and the dealer\'s upcard.' },
        { q: 'Can I count cards online?', a: 'Card counting is not effective in online blackjack as the deck is shuffled after each hand in most games.' }
      ]

      for (let i = 0; i < Math.min(blogPostIds.length, 2); i++) {
        for (let j = 0; j < 2; j++) {
          const faqIndex = i * 2 + j
          if (faqIndex < faqData.length) {
            blogFaqs.push({
              question: faqData[faqIndex].q,
              answer: faqData[faqIndex].a,
              blog_post_id: blogPostIds[i],
              is_active: true,
              required: false,
              order_id: j + 1,
              created_at: now,
              updated_at: now
            })
          }
        }
      }

      if (blogFaqs.length > 0) {
        await queryInterface.bulkInsert('faq', blogFaqs, {})
        console.log(`Inserted ${blogFaqs.length} blog post FAQs`)
      }
    }

    // ========================================
    // 2. Dynamic Game Pages
    // ========================================
    const existingGamePages = await queryInterface.sequelize.query(
      `SELECT game_page_id AS "id" FROM game_pages WHERE title LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingGamePages.length === 0) {
      const gamePages = [
        {
          title: 'Demo: Slots Collection',
          heading: 'Premium Slot Games',
          meta_title: 'Best Online Slots | GammaSweep Casino',
          meta_description: 'Play the best online slots with high RTP and exciting bonus features. New games added weekly!',
          slug: 'demo-slots-collection',
          html_content: `<div class="game-page-intro">
<h1>Welcome to Our Slots Collection</h1>
<p>Discover hundreds of exciting slot games from top providers. From classic fruit machines to modern video slots with immersive themes and massive jackpots.</p>
</div>`,
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Slots Collection',
            description: 'Premium online slot games'
          }),
          end_content: '<p>New slots are added every week. Check back often for the latest releases!</p>',
          is_active: true,
          order_id: 1,
          more_details: JSON.stringify({ category: 'slots', featured: true }),
          image: JSON.stringify({ url: 'https://placehold.co/400x300/1a1a2e/00ff88?text=Slots', alt: 'Slots Collection' }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Table Games',
          heading: 'Classic Table Games',
          meta_title: 'Table Games | Blackjack, Roulette & More',
          meta_description: 'Play classic table games including blackjack, roulette, baccarat, and poker variants.',
          slug: 'demo-table-games',
          html_content: `<div class="game-page-intro">
<h1>Table Games Collection</h1>
<p>Experience the thrill of classic casino table games. Test your skills at blackjack, try your luck at roulette, or enjoy the elegance of baccarat.</p>
</div>`,
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Table Games',
            description: 'Classic casino table games'
          }),
          end_content: '<p>All our table games feature realistic graphics and smooth gameplay.</p>',
          is_active: true,
          order_id: 2,
          more_details: JSON.stringify({ category: 'table-games', featured: true }),
          image: JSON.stringify({ url: 'https://placehold.co/400x300/2d2d44/ffcc00?text=Table+Games', alt: 'Table Games' }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Live Casino',
          heading: 'Live Dealer Games',
          meta_title: 'Live Casino | Real Dealers, Real Action',
          meta_description: 'Play with real dealers in our live casino. Stream HD quality games 24/7.',
          slug: 'demo-live-casino',
          html_content: `<div class="game-page-intro">
<h1>Live Casino Experience</h1>
<p>Join our live tables and interact with professional dealers in real-time. Experience the authentic casino atmosphere from anywhere.</p>
</div>`,
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Live Casino',
            description: 'Live dealer casino games'
          }),
          end_content: '<p>Our live casino operates 24/7 with tables for all budgets.</p>',
          is_active: true,
          order_id: 3,
          more_details: JSON.stringify({ category: 'live-casino', featured: true }),
          image: JSON.stringify({ url: 'https://placehold.co/400x300/1e3a5f/00ccff?text=Live+Casino', alt: 'Live Casino' }),
          created_at: now,
          updated_at: now
        },
        {
          title: 'Demo: Jackpot Games',
          heading: 'Progressive Jackpots',
          meta_title: 'Jackpot Games | Win Big at GammaSweep',
          meta_description: 'Play progressive jackpot games with life-changing prize pools. Your next spin could be the big one!',
          slug: 'demo-jackpot-games',
          html_content: `<div class="game-page-intro">
<h1>Jackpot Games</h1>
<p>Chase life-changing wins with our progressive jackpot games. Watch the prize pools grow in real-time and be the next big winner!</p>
</div>`,
          schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Jackpot Games',
            description: 'Progressive jackpot games'
          }),
          end_content: '<p>Jackpots are won regularly. Will you be next?</p>',
          is_active: true,
          order_id: 4,
          more_details: JSON.stringify({ category: 'jackpots', featured: false }),
          image: JSON.stringify({ url: 'https://placehold.co/400x300/5f3d1a/ff9933?text=Jackpots', alt: 'Jackpot Games' }),
          created_at: now,
          updated_at: now
        }
      ]

      await queryInterface.bulkInsert('game_pages', gamePages, {})
      console.log(`Inserted ${gamePages.length} demo game pages`)

      // Get inserted game page IDs
      const insertedPages = await queryInterface.sequelize.query(
        `SELECT game_page_id AS "id" FROM game_pages WHERE title LIKE 'Demo:%' ORDER BY game_page_id;`,
        { type: QueryTypes.SELECT }
      )
      const gamePageIds = insertedPages.map(p => p.id)

      // Add Game Page FAQs
      const gamePageFaqs = []
      const gpFaqData = [
        { q: 'How do I play slots?', a: 'Simply select a game, set your bet amount, and click spin. Match symbols on paylines to win!' },
        { q: 'What are paylines?', a: 'Paylines are the lines on which winning combinations are formed. More paylines mean more chances to win.' },
        { q: 'What is the house edge in blackjack?', a: 'With perfect basic strategy, the house edge in blackjack can be as low as 0.5%.' },
        { q: 'Can I play for free?', a: 'Yes! Most of our games offer a demo mode where you can play with virtual credits.' }
      ]

      for (let i = 0; i < Math.min(gamePageIds.length, 2); i++) {
        for (let j = 0; j < 2; j++) {
          const faqIndex = i * 2 + j
          if (faqIndex < gpFaqData.length) {
            gamePageFaqs.push({
              question: gpFaqData[faqIndex].q,
              answer: gpFaqData[faqIndex].a,
              game_page_id: gamePageIds[i],
              is_active: true,
              required: false,
              order_id: j + 1,
              created_at: now,
              updated_at: now
            })
          }
        }
      }

      if (gamePageFaqs.length > 0) {
        await queryInterface.bulkInsert('game-page-faq', gamePageFaqs, {})
        console.log(`Inserted ${gamePageFaqs.length} game page FAQs`)
      }

      // Add Game Page Cards
      const gamePageCards = []
      const cardData = [
        { title: 'New Releases', desc: 'Check out the latest slot games added this week' },
        { title: 'Top Rated', desc: 'Our highest-rated games by player reviews' },
        { title: 'Blackjack Variants', desc: 'Classic, European, and specialty blackjack games' },
        { title: 'Roulette Tables', desc: 'European, American, and French roulette' }
      ]

      for (let i = 0; i < Math.min(gamePageIds.length, 2); i++) {
        for (let j = 0; j < 2; j++) {
          const cardIndex = i * 2 + j
          if (cardIndex < cardData.length) {
            gamePageCards.push({
              title: cardData[cardIndex].title,
              description: cardData[cardIndex].desc,
              game_page_id: gamePageIds[i],
              is_active: true,
              order_id: j + 1,
              more_details: JSON.stringify({ link: `/games/${cardData[cardIndex].title.toLowerCase().replace(/\s+/g, '-')}` }),
              image: JSON.stringify({ url: `https://placehold.co/300x200/1a1a2e/00ff88?text=${encodeURIComponent(cardData[cardIndex].title)}`, alt: cardData[cardIndex].title }),
              created_at: now,
              updated_at: now
            })
          }
        }
      }

      if (gamePageCards.length > 0) {
        await queryInterface.bulkInsert('game_page_cards', gamePageCards, {})
        console.log(`Inserted ${gamePageCards.length} game page cards`)
      }
    }

    // ========================================
    // 3. Image Gallery
    // ========================================
    const existingGallery = await queryInterface.sequelize.query(
      `SELECT image_id AS "id" FROM gallery WHERE name LIKE 'Demo:%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )

    if (existingGallery.length === 0) {
      const galleryImages = [
        { name: 'Demo: Slots Banner', image_url: 'https://placehold.co/1920x600/1a1a2e/00ff88?text=Slots+Banner', created_at: now, updated_at: now },
        { name: 'Demo: Table Games Banner', image_url: 'https://placehold.co/1920x600/2d2d44/ffcc00?text=Table+Games', created_at: now, updated_at: now },
        { name: 'Demo: Live Casino Banner', image_url: 'https://placehold.co/1920x600/1e3a5f/00ccff?text=Live+Casino', created_at: now, updated_at: now },
        { name: 'Demo: Jackpot Banner', image_url: 'https://placehold.co/1920x600/5f3d1a/ff9933?text=Jackpots', created_at: now, updated_at: now },
        { name: 'Demo: VIP Banner', image_url: 'https://placehold.co/1920x600/3d1a5f/ff66cc?text=VIP+Program', created_at: now, updated_at: now },
        { name: 'Demo: Promo Card 1', image_url: 'https://placehold.co/600x400/1a1a2e/00ff88?text=Promo+1', created_at: now, updated_at: now },
        { name: 'Demo: Promo Card 2', image_url: 'https://placehold.co/600x400/2d2d44/ffcc00?text=Promo+2', created_at: now, updated_at: now },
        { name: 'Demo: Promo Card 3', image_url: 'https://placehold.co/600x400/1e3a5f/00ccff?text=Promo+3', created_at: now, updated_at: now },
        { name: 'Demo: Game Thumbnail 1', image_url: 'https://placehold.co/300x300/1a1a2e/00ff88?text=Game+1', created_at: now, updated_at: now },
        { name: 'Demo: Game Thumbnail 2', image_url: 'https://placehold.co/300x300/2d2d44/ffcc00?text=Game+2', created_at: now, updated_at: now },
        { name: 'Demo: Game Thumbnail 3', image_url: 'https://placehold.co/300x300/1e3a5f/00ccff?text=Game+3', created_at: now, updated_at: now },
        { name: 'Demo: Game Thumbnail 4', image_url: 'https://placehold.co/300x300/5f3d1a/ff9933?text=Game+4', created_at: now, updated_at: now }
      ]

      await queryInterface.bulkInsert('gallery', galleryImages, {})
      console.log(`Inserted ${galleryImages.length} gallery images`)
    }

    console.log('SEO Management demo data seeding completed!')
  },

  async down (queryInterface) {
    // Remove demo gallery images
    await queryInterface.sequelize.query(
      `DELETE FROM gallery WHERE name LIKE 'Demo:%';`
    )

    // Remove demo game page cards
    await queryInterface.sequelize.query(
      `DELETE FROM game_page_cards WHERE game_page_id IN (SELECT game_page_id FROM game_pages WHERE title LIKE 'Demo:%');`
    )

    // Remove demo game page FAQs
    await queryInterface.sequelize.query(
      `DELETE FROM "game-page-faq" WHERE game_page_id IN (SELECT game_page_id FROM game_pages WHERE title LIKE 'Demo:%');`
    )

    // Remove demo game pages
    await queryInterface.sequelize.query(
      `DELETE FROM game_pages WHERE title LIKE 'Demo:%';`
    )

    // Remove demo blog post FAQs
    await queryInterface.sequelize.query(
      `DELETE FROM faq WHERE blog_post_id IN (SELECT blog_post_id FROM blog_post WHERE meta_title LIKE 'Demo:%');`
    )

    // Remove demo blog posts
    await queryInterface.sequelize.query(
      `DELETE FROM blog_post WHERE meta_title LIKE 'Demo:%';`
    )

    console.log('SEO Management demo data removed')
  }
}
