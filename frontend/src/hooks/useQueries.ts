import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Lesson, Difficulty } from '../backend';

export function useListAllLessons() {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllLessons();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProgress() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint[]>({
    queryKey: ['progress'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.markComplete(lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}

export { Difficulty };
