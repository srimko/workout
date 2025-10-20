import { useState } from "react";

export interface UseModalReturn {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

export function useModal(defaultOpen = false): UseModalReturn {
    const [ isOpen, setIsOpen ] = useState(defaultOpen);

    const open = () => {
        setIsOpen(true);
    }
    
    const close = () => {
        setIsOpen(false);
    }
    
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    return {
        isOpen,
        open,
        close,
        toggle
    };
}