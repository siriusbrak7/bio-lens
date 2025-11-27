import { Unit } from './types';

export const BIOLOGY_CURRICULUM: Unit[] = [
  {
    id: 'unit-1',
    title: 'UNIT 1: FOUNDATIONS OF BIOLOGY',
    topics: [
      { id: 'u1-t1', title: 'Biological Molecules' },
      { id: 'u1-t2', title: 'Cell Structure and Function' },
      { id: 'u1-t3', title: 'Cell Membrane and Transport' },
      { id: 'u1-t4', title: 'Enzymes and Metabolism' },
    ]
  },
  {
    id: 'unit-2',
    title: 'UNIT 2: CELLULAR PROCESSES',
    topics: [
      { id: 'u2-t1', title: 'Cellular Respiration' },
      { id: 'u2-t2', title: 'Photosynthesis' },
      { id: 'u2-t3', title: 'Cell Cycle and Division' },
      { id: 'u2-t4', title: 'DNA Structure and Replication' },
      { id: 'u2-t5', title: 'Protein Synthesis' },
    ]
  },
  {
    id: 'unit-3',
    title: 'UNIT 3: GENETICS AND INHERITANCE',
    topics: [
      { id: 'u3-t1', title: 'Mendelian Genetics' },
      { id: 'u3-t2', title: 'Molecular Genetics' },
      { id: 'u3-t3', title: 'Gene Expression and Regulation' },
      { id: 'u3-t4', title: 'Genetic Technology' },
      { id: 'u3-t5', title: 'Human Genetics and Genomics' },
    ]
  },
  {
    id: 'unit-4',
    title: 'UNIT 4: EVOLUTION AND DIVERSITY',
    topics: [
      { id: 'u4-t1', title: 'Theory of Evolution' },
      { id: 'u4-t2', title: 'Mechanisms of Evolution' },
      { id: 'u4-t3', title: 'Classification and Taxonomy' },
      { id: 'u4-t4', title: 'Biodiversity' },
      { id: 'u4-t5', title: 'History of Life on Earth' },
    ]
  },
  {
    id: 'unit-5',
    title: 'UNIT 5: ECOLOGY AND ENVIRONMENT',
    topics: [
      { id: 'u5-t1', title: 'Ecosystems and Biomes' },
      { id: 'u5-t2', title: 'Population Ecology' },
      { id: 'u5-t3', title: 'Community Interactions' },
      { id: 'u5-t4', title: 'Biogeochemical Cycles' },
      { id: 'u5-t5', title: 'Conservation Biology' },
    ]
  },
  {
    id: 'unit-6',
    title: 'UNIT 6: HUMAN BIOLOGY',
    topics: [
      { id: 'u6-t1', title: 'Digestive and Circulatory Systems' },
      { id: 'u6-t2', title: 'Respiratory and Excretory Systems' },
      { id: 'u6-t3', title: 'Nervous and Endocrine Systems' },
      { id: 'u6-t4', title: 'Immune System' },
      { id: 'u6-t5', title: 'Reproduction and Development' },
    ]
  },
  {
    id: 'unit-7',
    title: 'UNIT 7: INDUSTRIAL AND APPLIED BIOLOGY',
    topics: [
      { id: 'u7-t1', title: 'Biotechnology Applications' },
      { id: 'u7-t2', title: 'Fermentation and Industrial Processes' },
      { id: 'u7-t3', title: 'Agricultural Biology' },
      { id: 'u7-t4', title: 'Medical Biotechnology' },
      { id: 'u7-t5', title: 'Environmental Biotechnology' },
    ]
  }
];

export const SYSTEM_PROMPT_TEMPLATE = `
Act as an expert educational designer, senior curriculum developer, and biology specialist. 
You are helping design "BioLens" - a comprehensive interactive digital notebook.
Core Learning Philosophy: "Biological systems thinking".

You must generate content based on the following request.
Return the output strictly as JSON matching the schema provided.

UNIT REQUEST: {{UNIT_NAME}}
TOPIC FOCUS: {{TOPIC_NAME}}

Structure requirements:
1. Narrative: Engaging, structured with headings, bold terms for importance.
2. Checkpoints: 4 progressive questions (Recall -> Application -> Visual -> Critical).
3. Flashcards: 6-8 diverse cards.
4. Experiment: A virtual lab connection.
`;
