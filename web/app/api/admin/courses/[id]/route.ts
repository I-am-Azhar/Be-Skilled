import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
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

    const courseId = params.id

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
    }

    // Check if course exists
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Delete the course
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (deleteError) {
      console.error('Error deleting course:', deleteError)
      return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Course deleted successfully',
      course: { id: courseId, title: course.title }
    })
  } catch (error) {
    console.error('Delete course API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
