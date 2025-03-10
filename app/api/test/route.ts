import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    envVarStatus: {
      huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY ? 'Set' : 'Not set',
    },
    timestamp: new Date().toISOString(),
  });
} 