'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus } from 'lucide-react';

interface AddAdvisorFormProps {
    onAdd: (number: string, name: string) => boolean;
}

export default function AddAdvisorForm({ onAdd }: AddAdvisorFormProps) {
    const [newNumber, setNewNumber] = useState('');
    const [newName, setNewName] = useState('');

    const handleAdd = () => {
        const success = onAdd(newNumber, newName);
        if (success) {
            setNewNumber('');
            setNewName('');
        }
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Añadir Nuevo Asesor
            </label>
            <div className="flex flex-col md:flex-row gap-2">
                <Input
                    placeholder="Nombre (Opcional)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="md:w-1/3"
                />
                <Input
                    placeholder="Ej: 573166541275"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    className="flex-1"
                />
                <Button variant="secondary" onClick={handleAdd} className="gap-2 shrink-0">
                    <Plus className="w-4 h-4" /> Añadir
                </Button>
            </div>
        </div>
    );
}
