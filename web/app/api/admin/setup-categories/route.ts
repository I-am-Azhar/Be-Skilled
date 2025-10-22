import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('Starting category and course updates...');

    // 1. Create new categories
    const categories = [
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Learn digital marketing strategies and tools', is_active: true, sort_order: 1 },
      { name: 'Graphic Designing', slug: 'graphic-designing', description: 'Master graphic design and visual communication', is_active: true, sort_order: 2 },
      { name: 'Freelancing & Growth', slug: 'freelancing-growth', description: 'Build your freelance career and grow your business', is_active: true, sort_order: 3 }
    ];

    const categoryMap: { [key: string]: string } = {};

    for (const category of categories) {
      const { data, error } = await supabase
        .from('course_categories')
        .upsert(category, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error(`Error creating category ${category.name}:`, error);
        return NextResponse.json({ error: `Failed to create category ${category.name}` }, { status: 500 });
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

    const updateResults = [];

    for (const update of courseUpdates) {
      const categoryId = categoryMap[update.category];
      if (!categoryId) {
        console.error(`Category not found for: ${update.category}`);
        updateResults.push({ course: update.title, status: 'failed', error: 'Category not found' });
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
        updateResults.push({ course: update.title, status: 'failed', error: error.message });
      } else {
        console.log(`Updated course: ${update.title} -> ${update.category} (${update.tag})`);
        updateResults.push({ course: update.title, status: 'success', category: update.category, tag: update.tag });
      }
    }

    console.log('Category and course updates completed!');

    return NextResponse.json({ 
      success: true, 
      message: 'Categories and courses updated successfully',
      results: updateResults
    });
  } catch (error) {
    console.error('Error in update process:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


