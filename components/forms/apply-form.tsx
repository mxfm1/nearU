'use client'

import { useForm } from 'react-hook-form'
import { ApplySchema } from './schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

export const ApplyForm = () => {

    const form = useForm()

    const handleFormSubmit = (data: ApplySchema) => {
        console.log(data)
    }
    return (
        <form>
            <}>
        </form>
    )
}