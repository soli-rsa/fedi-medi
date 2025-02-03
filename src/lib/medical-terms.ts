import { Word } from "./types";

interface MedicalTerm {
  word: string;
  definition: string;
}

const medicalTermsList: MedicalTerm[] = [
  { word: "VIRUS", definition: "A pathogen that causes infectious diseases" },
  { word: "HEART", definition: "A muscular organ that pumps blood throughout the body" },
  { word: "BLOOD", definition: "A fluid that transports oxygen and nutrients to cells" },
  { word: "ORGAN", definition: "A part of the body that performs a specific function" },
  { word: "BONE", definition: "A hard tissue that supports and protects the body" },
  { word: "CLOTT", definition: "A mass of blood components that forms to stop bleeding" },
  { word: "DOSES", definition: "The measured amount of a medication or substance" },
  { word: "NERVE", definition: "A threadlike structure that transmits impulses between parts of the body" },
  { word: "SPINE", definition: "A column of vertebrae that protects the spinal cord" },
  { word: "TUMOR", definition: "An abnormal growth of tissue" },
  { word: "ULCER", definition: "A sore or lesion on the skin or mucous membrane" },
  { word: "PULSE", definition: "The rhythmic expansion and contraction of arteries" },
  { word: "JOINT", definition: "A connection between bones that allows movement" },
  { word: "LYMPH", definition: "A clear fluid that circulates through lymph vessels" },
  { word: "CELLS", definition: "The basic structural and functional units of living organisms" },
  { word: "VEINS", definition: "Blood vessels that carry blood toward the heart" },
  { word: "AORTA", definition: "The main artery that carries blood from the heart to the rest of the body" },
  { word: "LUNGS", definition: "Organs responsible for respiration and oxygen exchange" },
  { word: "SKULL", definition: "The bony structure that forms the head and protects the brain" },
  { word: "PLATE", definition: "A flat structure, such as a bone or a device used in surgery" },
  { word: "GLAND", definition: "An organ that secretes hormones or other substances" },
  { word: "FIBER", definition: "A threadlike structure, such as muscle or nerve fibers" },
  { word: "SERUM", definition: "The liquid part of blood after clotting factors are removed" },
  { word: "TOXIN", definition: "A poisonous substance produced by living organisms" },
  { word: "VENOM", definition: "A toxic substance secreted by animals like snakes or spiders" },
  { word: "MUCUS", definition: "A slippery secretion produced by mucous membranes" },
  { word: "PLAQE", definition: "A buildup of substances on teeth or in arteries" },
  { word: "SCALE", definition: "A small rigid plate forming the outer covering of fish or reptiles" },
  { word: "CRANE", definition: "A device used to lift heavy objects, or a type of bone in the neck" },
  { word: "BRACE", definition: "A device used to support or align parts of the body" },
  { word: "SPASM", definition: "A sudden, involuntary contraction of a muscle" },
  { word: "STENT", definition: "A tube inserted into a vessel or duct to keep it open" },
  { word: "SUTUR", definition: "A stitch used to hold tissue together after surgery" },
  { word: "TISSU", definition: "A group of cells that perform a specific function" },
  { word: "VITAM", definition: "An organic compound essential for normal growth and nutrition" },
  { word: "ZYGOT", definition: "A fertilized egg cell resulting from the union of gametes" },
  { word: "CORTX", definition: "The outer layer of an organ, such as the brain or kidney" },
  { word: "MEDIA", definition: "The middle layer of a blood vessel wall" },
  { word: "CALCI", definition: "A mineral essential for bone health and muscle function" },
  { word: "PLASM", definition: "The liquid part of blood or lymph" },
  { word: "SEPTM", definition: "A wall dividing two cavities, such as in the nose or heart" },
  { word: "TENON", definition: "A fibrous tissue that connects muscle to bone" },
  { word: "LIGAM", definition: "A band of tissue that connects bones or holds organs in place" },
  { word: "CAPIL", definition: "The smallest blood vessels where nutrient exchange occurs" },
  { word: "MELAN", definition: "A pigment responsible for skin, hair, and eye color" },
  { word: "ENZYM", definition: "A protein that catalyzes biochemical reactions" },
  { word: "ANTIB", definition: "A protein produced by the immune system to fight infections" },
  { word: "BACTE", definition: "Microscopic organisms that can cause disease" },
  { word: "FUNGI", definition: "A group of organisms that includes yeasts and molds" },
  { word: "PARAS", definition: "An organism that lives on or in a host and benefits at the host's expense" },
  { word: "ALLER", definition: "A hypersensitivity reaction to a substance" },
  { word: "ASTHM", definition: "A chronic respiratory condition causing difficulty in breathing" },
  { word: "DIABE", definition: "A metabolic disorder characterized by high blood sugar" },
  { word: "STERO", definition: "A type of lipid or hormone with a specific molecular structure" },
  { word: "ANEST", definition: "A substance that induces loss of sensation or consciousness" },
  { word: "SCLER", definition: "A hardening or thickening of tissue, such as in arteries" },
  { word: "NEURO", definition: "Relating to nerves or the nervous system" },
  { word: "PSYCH", definition: "Relating to the mind or mental processes" },
  { word: "TRAUM", definition: "A physical injury or emotional shock" },
  { word: "FEBRI", definition: "Relating to fever or elevated body temperature" },
  { word: "SEPTI", definition: "Relating to infection or the presence of harmful bacteria" }
];

export const medicalTerms: MedicalTerm[] = medicalTermsList;

// These exports are kept for backward compatibility
export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * medicalTerms.length);
  return medicalTerms[randomIndex].word;
};

export const isValidWord = (word: string): boolean => {
  return medicalTerms.some(term => term.word === word.toUpperCase());
};

export const getWordDefinition = (word: string): string | undefined => {
  const term = medicalTerms.find(term => term.word === word.toUpperCase());
  return term?.definition;
};
