import { StudyResourceItem } from '../types';
import { CURATED_STUDY_RESOURCES } from './curated-sources';

export function getResourcesForCanvasNode(nodeId: string): StudyResourceItem[] {
  return CURATED_STUDY_RESOURCES.filter((resource: StudyResourceItem) =>
    resource.canvasNodeIds.includes(nodeId)
  );
}

export function generateCapstoneBrief(nodeId: string, roleTitle: string) {
  return {
    title: `Production ${roleTitle} Capstone Project`,
    description: `Build an end-to-end, production-ready application demonstrating mastery of ${roleTitle} for your portfolio.`,
    acceptanceCriteria: [
      'All code hosted on GitHub with clear README.md instructions',
      '100% test coverage or integration tests verified',
      'Deployed to a production environment (OWP /Clo and verifiable live)',
      'Verified by JobMint GitHub Project Verifier',
    ],
    suggestedTech: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
  };
}
