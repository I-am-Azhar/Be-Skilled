// This script should be run from the web directory with proper environment variables
// For now, let's create a simple API endpoint to handle this instead

console.log('This script requires Supabase environment variables.');
console.log('Please run the category update through the admin interface or set up environment variables.');
console.log('');
console.log('Required environment variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL');
console.log('- SUPABASE_SERVICE_ROLE_KEY');
console.log('');
console.log('Alternatively, you can manually add the categories through the admin interface.');

async function updateCategoriesAndCourses() {
  try {
    console.log('Starting category and course updates...');

    // 1. Create new categories
    const categories = [
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Learn digital marketing strategies and tools' },
      { name: 'Graphic Designing', slug: 'graphic-designing', description: 'Master graphic design and visual communication' },
      { name: 'Freelancing & Growth', slug: 'freelancing-growth', description: 'Build your freelance career and grow your business' }
    ];

    const categoryMap = {};

    for (const category of categories) {
      const { data, error } = await supabase
        .from('course_categories')
        .upsert(category, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error(`Error creating category ${category.name}:`, error);
      } else {
        console.log(`Created/Updated category: ${category.name} (ID: ${data.id})`);
        categoryMap[category.name] = data.id;
      }
    }

    // 2. Update courses with appropriate categories and tags
    const courseUpdates = [
      // Digital Marketing courses
      { title: 'Meta Ads Mastery', category: 'Digital Marketing', tag: 'Paid Advertising' },
      { title: 'Google Ads Mastery', category: 'Digital Marketing', tag: 'Paid Advertising' },
      { title: 'Social Media Marketing Strategy', category: 'Digital Marketing', tag: 'Social Media' },
      { title: 'Content Creation & Branding', category: 'Digital Marketing', tag: 'Content Marketing' },
      { title: 'Reels & Short-Form Video Growth', category: 'Digital Marketing', tag: 'Video Marketing' },
      
      // Graphic Designing courses
      { title: 'Adobe Photoshop for Social Media & Marketing', category: 'Graphic Designing', tag: 'Adobe Tools' },
      { title: 'Canva Design Masterclass', category: 'Graphic Designing', tag: 'Design Tools' },
      { title: 'Motion Graphics', category: 'Graphic Designing', tag: 'Animation' },
      { title: 'CapCut Pro', category: 'Graphic Designing', tag: 'Video Editing' },
      { title: 'CapCut Mastery for Reels & Ads', category: 'Graphic Designing', tag: 'Video Editing' },
      
      // Freelancing & Growth courses
      { title: 'Freelancing with Digital Marketing Skills', category: 'Freelancing & Growth', tag: 'Career Development' },
      { title: 'Portfolio Building & Personal Branding', category: 'Freelancing & Growth', tag: 'Personal Branding' }
    ];

    for (const update of courseUpdates) {
      const categoryId = categoryMap[update.category];
      if (!categoryId) {
        console.error(`Category not found for: ${update.category}`);
        continue;
      }

      const { data, error } = await supabase
        .from('courses')
        .update({
          category_id: categoryId,
          tag: update.tag
        })
        .eq('title', update.title);

      if (error) {
        console.error(`Error updating course ${update.title}:`, error);
      } else {
        console.log(`Updated course: ${update.title} -> ${update.category} (${update.tag})`);
      }
    }

    console.log('Category and course updates completed!');
  } catch (error) {
    console.error('Error in update process:', error);
  }
}

// Run the update
updateCategoriesAndCourses();
