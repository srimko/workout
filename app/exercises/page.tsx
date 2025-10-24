import { getExercisesWithCategory } from '@/lib/api/exercises';
import Image from 'next/image';

export default async function Exercises() {
    // Récupérer tous les exercices actifs avec leurs catégories
    const exercises = await getExercisesWithCategory(true);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Exercices</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((exercise) => (
                    <div
                        key={exercise.id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="relative w-full h-48">
                            <Image
                                src={exercise.image}
                                alt={exercise.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2">{exercise.title}</h2>
                            <p className="text-sm text-gray-600 mb-2">
                                Catégorie: <span className="font-medium">{exercise.category.name}</span>
                            </p>
                            {exercise.description && (
                                <p className="text-sm text-gray-700 line-clamp-3">
                                    {exercise.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {exercises.length === 0 && (
                <p className="text-center text-gray-500 mt-8">Aucun exercice disponible</p>
            )}
        </div>
    );
}