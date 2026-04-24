import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetInfo, Plan } from '@/types';

interface PetStore {
  photo: File | null;
  photoPreviewUrl: string | null;
  petInfo: PetInfo;
  selectedPlan: Plan;

  generatedImages: string[];
  generatedStory: string;
  resultId: string | null;

  setPhoto: (file: File) => void;
  clearPhoto: () => void;
  setPetInfo: (info: Partial<PetInfo>) => void;
  setSelectedPlan: (plan: Plan) => void;
  setResult: (images: string[], story: string, id: string) => void;
  reset: () => void;
}

const defaultPetInfo: PetInfo = {
  name: '',
  type: 'dog',
  breed: '',
  age: 1,
  gender: 'male',
  isAdopted: false,
  adoptedAt: undefined,
  personality: [],
  messageFromOwner: '',
};

export const usePetStore = create<PetStore>()(
  persist(
    (set) => ({
      photo: null,
      photoPreviewUrl: null,
      petInfo: defaultPetInfo,
      selectedPlan: 'basic',

      generatedImages: [],
      generatedStory: '',
      resultId: null,

      setPhoto: (file: File) => {
        const url = URL.createObjectURL(file);
        set({ photo: file, photoPreviewUrl: url });
      },

      clearPhoto: () => set({ photo: null, photoPreviewUrl: null }),

      setPetInfo: (info: Partial<PetInfo>) =>
        set((state) => ({ petInfo: { ...state.petInfo, ...info } })),

      setSelectedPlan: (plan: Plan) => set({ selectedPlan: plan }),

      setResult: (images: string[], story: string, id: string) =>
        set({ generatedImages: images, generatedStory: story, resultId: id }),

      reset: () =>
        set({
          photo: null,
          photoPreviewUrl: null,
          petInfo: defaultPetInfo,
          selectedPlan: 'basic',
          generatedImages: [],
          generatedStory: '',
          resultId: null,
        }),
    }),
    {
      name: 'babypet-store',
      partialize: (state) => ({
        petInfo: state.petInfo,
        selectedPlan: state.selectedPlan,
        photoPreviewUrl: state.photoPreviewUrl,
        generatedImages: state.generatedImages,
        generatedStory: state.generatedStory,
        resultId: state.resultId,
      }),
    }
  )
);
