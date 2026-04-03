import Link from "next/link";

export default function BankBreadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb mb-4">
      <ol
        className="flex gap-2 text-sm text-gray-500"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {items.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center"
          >
            {item.href ? (
              <Link href={item.href} itemProp="item" className="hover:text-purple-600">
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span itemProp="name" aria-current="page" className="text-gray-900 dark:text-gray-100 font-medium">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
            {index < items.length - 1 && <span aria-hidden="true" className="ml-2"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
