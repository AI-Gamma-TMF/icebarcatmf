'use strict'

const { QueryTypes } = require('sequelize')

// Demo data for Banner Management section
// - Banner Management (GET /api/v1/banner) -> page_banners table
//
// This seeder is idempotent: it checks for existing demo banners before inserting.

module.exports = {
  async up (queryInterface) {
    const now = new Date()

    // Check if demo banners already exist
    const existingBanners = await queryInterface.sequelize.query(
      `SELECT page_banner_id AS "id" FROM page_banners WHERE name LIKE 'Demo Banner%' LIMIT 1;`,
      { type: QueryTypes.SELECT }
    )
    if (existingBanners.length > 0) {
      console.log('Demo banners already exist, skipping...')
      return
    }

    // Demo banner data with placeholder images (using public placeholder URLs)
    const demoBanners = [
      {
        visibility: 1,
        desktop_image_url: 'https://placehold.co/1920x400/1a1a2e/00ff88?text=Welcome+to+GammaSweep',
        mobile_image_url: 'https://placehold.co/800x400/1a1a2e/00ff88?text=GammaSweep',
        btn_text: 'Play Now',
        btn_redirection: '/games',
        page_name: 'home',
        name: 'Demo Banner - Welcome',
        text_one: 'Welcome to GammaSweep',
        text_two: 'Your Ultimate Gaming Destination',
        text_three: 'Join thousands of players today!',
        order: 1,
        is_active: true,
        is_count_down: false,
        start_date: now,
        end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        created_at: now,
        updated_at: now
      },
      {
        visibility: 1,
        desktop_image_url: 'https://placehold.co/1920x400/2d2d44/ffcc00?text=Daily+Bonus',
        mobile_image_url: 'https://placehold.co/800x400/2d2d44/ffcc00?text=Daily+Bonus',
        btn_text: 'Claim Now',
        btn_redirection: '/bonus',
        page_name: 'home',
        name: 'Demo Banner - Daily Bonus',
        text_one: 'Daily Bonus Available!',
        text_two: 'Get Free Coins Every Day',
        text_three: 'Login daily for rewards',
        order: 2,
        is_active: true,
        is_count_down: false,
        start_date: now,
        end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now
      },
      {
        visibility: 1,
        desktop_image_url: 'https://placehold.co/1920x400/1e3a5f/00ccff?text=New+Games',
        mobile_image_url: 'https://placehold.co/800x400/1e3a5f/00ccff?text=New+Games',
        btn_text: 'Explore',
        btn_redirection: '/games/new',
        page_name: 'games',
        name: 'Demo Banner - New Games',
        text_one: 'New Games Added!',
        text_two: 'Check out our latest slots',
        text_three: 'Fresh content every week',
        order: 3,
        is_active: true,
        is_count_down: false,
        start_date: now,
        end_date: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        created_at: now,
        updated_at: now
      },
      {
        visibility: 1,
        desktop_image_url: 'https://placehold.co/1920x400/3d1a5f/ff66cc?text=VIP+Program',
        mobile_image_url: 'https://placehold.co/800x400/3d1a5f/ff66cc?text=VIP',
        btn_text: 'Join VIP',
        btn_redirection: '/vip',
        page_name: 'promotions',
        name: 'Demo Banner - VIP Program',
        text_one: 'Exclusive VIP Benefits',
        text_two: 'Unlock premium rewards',
        text_three: 'Level up your experience',
        order: 4,
        is_active: true,
        is_count_down: true,
        start_date: now,
        end_date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days countdown
        created_at: now,
        updated_at: now
      },
      {
        visibility: 1,
        desktop_image_url: 'https://placehold.co/1920x400/5f3d1a/ff9933?text=Tournament',
        mobile_image_url: 'https://placehold.co/800x400/5f3d1a/ff9933?text=Tournament',
        btn_text: 'Enter Now',
        btn_redirection: '/tournaments',
        page_name: 'tournaments',
        name: 'Demo Banner - Tournament',
        text_one: 'Weekly Tournament',
        text_two: 'Compete for the top prize',
        text_three: '$10,000 Prize Pool',
        order: 5,
        is_active: true,
        is_count_down: true,
        start_date: now,
        end_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days countdown
        created_at: now,
        updated_at: now
      }
    ]

    await queryInterface.bulkInsert('page_banners', demoBanners, {})

    console.log(`Inserted ${demoBanners.length} demo banners`)
  },

  async down (queryInterface) {
    // Remove demo banners
    await queryInterface.sequelize.query(
      `DELETE FROM page_banners WHERE name LIKE 'Demo Banner%';`
    )
  }
}
