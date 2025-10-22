'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TextField } from '@/components/ui/text-field';
import { Button } from '@/components/ui/button';
import { Note } from '@/components/ui/note';
import { Person } from '@/lib/types';

interface PersonListProps {
  persons: Person[];
  onAddPerson: (name: string) => { success: boolean; error?: string };
  onRemovePerson: (id: string) => void;
}

/**
 * PersonList component for managing persons in bill splitting
 * Requirements: 1.1, 1.2, 1.3
 */
export function PersonList({ persons, onAddPerson, onRemovePerson }: PersonListProps) {
  const [personName, setPersonName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddPerson = () => {
    const result = onAddPerson(personName);
    
    if (result.success) {
      setPersonName('');
      setError(null);
    } else {
      setError(result.error || 'Failed to add person');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPerson();
    }
  };

  return (
    <Card className='shadow-xl'>
      <CardHeader>
        <CardTitle>เพื่อน</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add person form */}
        <form onSubmit={(e) => { e.preventDefault(); handleAddPerson(); }} className="flex flex-col sm:flex-row gap-3 sm:gap-2" aria-label="Add person form">
          <div className="flex-1">
            <TextField
              label="ชื่อเพื่อน"
              value={personName}
              onChange={setPersonName}
              onKeyDown={handleKeyDown}
              aria-label="Person name input"
            />
          </div>
          <Button
            type="submit"
            onPress={handleAddPerson}
            className="sm:self-end w-full sm:w-auto bg-green-500 text-secondary duration-300 transition-all ease-in-out hover:shadow-xl "
            aria-label="Add person"
          >
            เพิ่มคน
          </Button>
        </form>

        {/* Validation error display */}
        {error && (
          <Note variant="destructive" className="animate-slide-in">
            {error}
          </Note>
        )}

        {/* List of added persons */}
        {persons.length > 0 && (
          <div className="space-y-2" role="region" aria-label="List of persons">
            <h4 className="text-sm font-medium" id="persons-list-heading">รายชื่อเพื่อน:</h4>
            <ul className="space-y-2" aria-labelledby="persons-list-heading">
              {persons.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center justify-between gap-3 rounded-md border p-3 sm:p-2 bg-primary-foreground animate-fade-in hover:border-primary/50 transition-colors"
                >
                  <span className="text-sm sm:text-base flex-1 min-w-0 truncate">{person.name}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onPress={() => onRemovePerson(person.id)}
                    aria-label={`Remove ${person.name}`}
                    className="shrink-0 bg-red-600 text-white duration-300 transition-all  hover:shadow-xl "
                  >
                    ลบ
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty state */}
        {persons.length === 0 && (
          <div className="text-center py-8 px-4 rounded-lg bg-muted/30">
            <svg
              className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              ยังไม่มีรายชื่อคนที่ต้องการ หาร
            </p>
            <p className="text-xs text-muted-foreground">
              กรุณาเพิ่มชื่อ 'คน' เพื่อจะได้หารได้ไอเวร
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
