import { addPlace } from '@/api/place';
import { PlaceMarker } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type AddPlaceMutationVariables = {
  newPlace: PlaceMarker;
  mapId: number;
};

export const useAddPlaceMutation = () => {
  const queryClient = useQueryClient();

  const addPlaceMutation = useMutation({
    mutationFn: ({ newPlace, mapId }: AddPlaceMutationVariables) =>
      addPlace(newPlace, mapId),
    onSuccess: (data, variables: AddPlaceMutationVariables) => {
      const { mapId } = variables;
      const placeId = data?.placeId ?? variables.newPlace.placeId;
      queryClient.invalidateQueries({ queryKey: ['places', mapId, placeId] });
    },
  });

  return addPlaceMutation;
};
