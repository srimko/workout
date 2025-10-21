import { createClient } from '@/utils/supabase/server';

export default async function Exercises() {
    const supabase = await createClient();

    // Récupérer des données depuis Supabase
    const { data, error } = await supabase
        .from('exercises')
        .select('*');

    console.log(data)

    if (error) {
        console.error('Erreur:', error);
    }

    return <div>
        <ul>
            {data && data.map((exercise, index) => (
                <li key={ index }>{exercise.name}</li>
            ))}
        </ul>
    </div>
}