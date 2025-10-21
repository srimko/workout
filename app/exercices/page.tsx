import { createClient } from '@/utils/supabase/server';

export default async function Exercices() {
    const supabase = await createClient();

    // Récupérer des données depuis Supabase
    const { data, error } = await supabase
        .from('exercices')
        .select('*');

    console.log(data)

    if (error) {
        console.error('Erreur:', error);
    }

    return <div>
        <ul>
            {data && data.map((exercice, index) => (
                <li key={ index }>{exercice.name}</li>
            ))}
        </ul>
    </div>
}