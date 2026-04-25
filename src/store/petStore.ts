import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PetInfo, Plan } from '@/types';

interface PetStore {
  photos: File[];
  photoPreviewUrls: string[];
  petInfo: PetInfo;
  selectedPlan: Plan;

  generatedImages: string[];
  generatedStory: string;
  resultId: string | null;

  addPhotos: (files: File[]) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
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
      photos: [],
      photoPreviewUrls: [],
      petInfo: defaultPetInfo,
      selectedPlan: 'basic',

      generatedImages: [],
      generatedStory: '',
      resultId: null,

      addPhotos: (files: File[]) => {
        set((state) => {
          const newUrls = files.map((f) => URL.createObjectURL(f));
          return {
            photos: [...state.photos, ...files],
            photoPreviewUrls: [...state.photoPreviewUrls, ...newUrls],
          };
        });
      },

      removePhoto: (index: number) => {
        set((state) => {
          const newPhotos = [...state.photos];
          const newUrls = [...state.photoPreviewUrls];
          URL.revokeObjectURL(newUrls[index]);
          newPhotos.splice(index, 1);
          newUrls.splice(index, 1);
          return { photos: newPhotos, photoPreviewUrls: newUrls };
        });
      },

      clearPhotos: () => {
        set((state) => {
          state.photoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
          return { photos: [], photoPreviewUrls: [] };
        });
      },

      setPetInfo: (info: Partial<PetInfo>) =>
        set((state) => ({ petInfo: { ...state.petInfo, ...info } })),

      setSelectedPlan: (plan: Plan) => set({ selectedPlan: plan }),

      setResult: (images: string[], story: string, id: string) =>
        set({ generatedImages: images, generatedStory: story, resultId: id }),

      reset: () =>
        set({
          photos: [],
          photoPreviewUrls: [],
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
        photoPreviewUrls: state.photoPreviewUrls,
        generatedImages: state.generatedImages,
        generatedStory: state.generatedStory,
        resultId: state.resultId,
      }),
    }
  )
);
