import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand-petrol text-white hover:bg-brand-mint hover:text-brand-dark-blue transition-colors duration-300',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-brand-petrol bg-background hover:bg-brand-petrol/10 hover:text-brand-petrol',
        secondary:
          'bg-brand-mint text-brand-dark-blue hover:bg-brand-mint/80',
        ghost: 'hover:bg-brand-petrol/10 hover:text-brand-petrol',
        link: 'text-brand-petrol underline-offset-4 hover:underline',
        subtle: 'bg-brand-aqua/20 text-brand-petrol hover:bg-brand-aqua/30',
        gold: 'bg-brand-gold text-brand-dark-blue hover:bg-brand-gold/90',
        aqua: 'bg-brand-aqua text-brand-dark-blue hover:bg-brand-aqua/80',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
