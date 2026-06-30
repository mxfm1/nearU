import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ApplyForm } from "@/components/forms/apply-form";
import { ReactNode } from "react";

export default function ApplyFormSection({ children }: { children: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <ApplyForm />
            </DialogContent>
        </Dialog>
    )
}