import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ApplyForm } from "../forms/apply-form";
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