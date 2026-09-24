import { NextRequest, NextResponse } from 'next/server';
import { generateAI } from '@repo/ai';
import { db, candidateProfiles, candidateSkills, skills, users, eq } from '@repo/database';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText, targetRole, saveToProfile } = body;

    if (!resumeText || resumeText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide at least 20 characters of resume text to analyze.' },
        { status: 400 }
      );
    }

    // Call Tier 1 Groq / Tier 2 Gemini cascade
    const aiResponse = await generateAI({
      task: 'ANALYZE_FULL_RESUME',
      input: { resumeText, targetRole: targetRole || 'Software Engineer' },
    });

    const analysis = aiResponse.result;

    // If user requested to save directly to candidate profile in PostgreSQL
    if (saveToProfile && analysis) {
      try {
        const session = await auth();
        const email = session?.user?.email || analysis.email || 'candidate@jobmint.ritualdev.in';

        let userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
        let userId: string;
        if (userList.length === 0) {
          const [newUser] = await db.insert(users).values({
            email,
            name: analysis.candidateName || email.split('@')[0],
            role: 'CANDIDATE',
          }).returning();
          userId = newUser.id;
        } else {
          userId = userList[0].id;
        }

        let profileList = await db.select().from(candidateProfiles).where(eq(candidateProfiles.userId, userId)).limit(1);
        if (profileList.length === 0) {
          await db.insert(candidateProfiles).values({
            userId,
            headline: analysis.recommendedRoles?.[0] || 'Software Engineer',
            bio: analysis.strengths?.[0] || 'Technical candidate',
            phone: analysis.phone || null,
            githubUrl: analysis.githubUrl || null,
            linkedinUrl: analysis.linkedinUrl || null,
          });
        } else {
          await db.update(candidateProfiles).set({
            headline: analysis.recommendedRoles?.[0] || profileList[0].headline,
            phone: analysis.phone || profileList[0].phone,
            githubUrl: analysis.githubUrl || profileList[0].githubUrl,
            linkedinUrl: analysis.linkedinUrl || profileList[0].linkedinUrl,
            updatedAt: new Date(),
          }).where(eq(candidateProfiles.id, profileList[0].id));
        }
      } catch (saveErr) {
        console.warn('Could not auto-save to profile, continuing with analysis result:', saveErr);
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      aiTelemetry: {
        provider: aiResponse.provider,
        modelUsed: aiResponse.modelUsed,
        tier: aiResponse.tier,
        latencyMs: aiResponse.latencyMs,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing resume with AI:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze resume' }, { status: 500 });
  }
}
