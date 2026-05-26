import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "text"
  | "icon"
  | "tableIcon"
  | "moreIcon"
  | "mini"
  | "dangerMini"
  | "alert"
  | "chip"
  | "chipActive"
  | "productIcon";

type BaseButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    href: string;
  };

type NativeButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: never;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "admin-primary-button",
  secondary: "admin-secondary-button",
  text: "admin-text-button",
  icon: "admin-icon-button",
  tableIcon: "admin-table-icon-button",
  moreIcon: "admin-more-link",
  mini: "admin-mini-button",
  dangerMini: "admin-mini-button danger",
  alert: "admin-alert-button",
  chip: "admin-filter-chip",
  chipActive: "admin-filter-chip active",
  productIcon: "admin-product-action"
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isLinkButton(props: ButtonProps): props is LinkButtonProps {
  return typeof (props as LinkButtonProps).href === "string";
}

export function Button(props: ButtonProps) {
  const { children, className, variant = "primary" } = props;
  const buttonClassName = cx(variantClasses[variant], className);

  if (isLinkButton(props)) {
    const { children: linkChildren, className: _linkClassName, variant: _linkVariant, href, ...linkProps } = props;

    return (
      <Link href={href} {...linkProps} className={buttonClassName}>
        {linkChildren}
      </Link>
    );
  }

  const {
    children: buttonChildren,
    className: _buttonClassName,
    variant: _buttonVariant,
    ...buttonProps
  } = props as NativeButtonProps;

  return (
    <button {...buttonProps} className={buttonClassName}>
      {buttonChildren}
    </button>
  );
}
