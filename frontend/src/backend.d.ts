import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lesson {
    id: bigint;
    title: string;
    difficulty: Difficulty;
    description: string;
    codeSnippet: string;
}
export enum Difficulty {
    Beginner = "Beginner",
    Advanced = "Advanced",
    Intermediate = "Intermediate"
}
export interface backendInterface {
    addLesson(title: string, description: string, codeSnippet: string, difficulty: Difficulty): Promise<bigint>;
    getLessonById(id: bigint): Promise<Lesson | null>;
    getProgress(): Promise<Array<bigint>>;
    listAllLessons(): Promise<Array<Lesson>>;
    markComplete(lessonId: bigint): Promise<void>;
}
