"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { deleteCategory, toggleCategoryVisibility, updateCategoriesOrder } from "@/lib/actions";

// Match the category type returned from Prisma
type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  isVisible: boolean;
  isFeaturedOnHome: boolean;
  _count: { products: number };
};

function SortableCategoryRow({
  category,
  isDragDisabled,
}: {
  category: Category;
  isDragDisabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: isDragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderBottom: "1px solid #f0f0f0",
    backgroundColor: isDragging ? "#fafafa" : "white",
    zIndex: isDragging ? 1 : 0,
    position: (isDragging ? "relative" : "static") as any,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td style={{ padding: "1rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            {...attributes}
            {...listeners}
            style={{
              cursor: isDragDisabled ? "not-allowed" : "grab",
              padding: "0.5rem",
              color: "#ccc",
              display: "flex",
              alignItems: "center",
              visibility: isDragDisabled ? "hidden" : "visible",
            }}
            title={isDragDisabled ? "Sorting is disabled" : "Drag to reorder"}
          >
            ☰
          </div>
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }}
            />
          ) : (
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#f0faf9",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              🎂
            </div>
          )}
          <span style={{ fontWeight: "600" }}>{category.name}</span>
        </div>
      </td>
      <td style={{ padding: "1rem 1.5rem", color: "#888", fontSize: "0.9rem" }}>/{category.slug}</td>
      <td style={{ padding: "1rem 1.5rem" }}>
        <span
          style={{
            background: "#f0faf9",
            color: "var(--color-primary)",
            padding: "0.2rem 0.6rem",
            borderRadius: "12px",
            fontSize: "0.8rem",
            fontWeight: "600",
          }}
        >
          {category._count.products} products
        </span>
      </td>
      <td style={{ padding: "1rem 1.5rem" }}>
        <form action={toggleCategoryVisibility.bind(null, category.id, !category.isVisible)}>
          <button
            type="submit"
            style={{
              background: category.isVisible ? "#e6f7f5" : "#fff0f0",
              color: category.isVisible ? "var(--color-primary)" : "#d32f2f",
              padding: "0.35rem 0.8rem",
              borderRadius: "12px",
              fontSize: "0.8rem",
              fontWeight: "700",
              border: "1px solid " + (category.isVisible ? "#b2dfdb" : "#ffcdd2"),
              cursor: "pointer",
            }}
            title={category.isVisible ? "Click to make inactive" : "Click to make active"}
          >
            {category.isVisible ? "● Active" : "○ Inactive"}
          </button>
        </form>
      </td>
      <td style={{ padding: "1rem 1.5rem" }}>
        {category.isFeaturedOnHome ? (
          <span style={{ fontSize: "1.2rem" }}>⭐</span>
        ) : (
          <span style={{ color: "#ccc" }}>—</span>
        )}
      </td>
      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <Link
            href={`/shop?category=${category.slug}`}
            target="_blank"
            style={{
              padding: "0.35rem 0.9rem",
              background: "var(--color-background-glass, #f0fdfa)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              textDecoration: "none",
              color: "var(--color-primary, #0f766e)",
            }}
          >
            View
          </Link>
          <Link
            href={`/dashboard/categories/${category.id}/edit`}
            style={{
              padding: "0.35rem 0.9rem",
              background: "#f0f0f0",
              borderRadius: "6px",
              fontSize: "0.85rem",
              textDecoration: "none",
              color: "#333",
            }}
          >
            Edit
          </Link>
          <form action={deleteCategory.bind(null, category.id)}>
            <button
              type="submit"
              style={{
                padding: "0.35rem 0.9rem",
                background: "#fff0f0",
                color: "#d32f2f",
                borderRadius: "6px",
                fontSize: "0.85rem",
                cursor: "pointer",
                border: "none",
              }}
            >
              Delete
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}

export default function SortableCategoryList({
  initialCategories,
  isSortable,
}: {
  initialCategories: Category[];
  isSortable: boolean;
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Keep internal state synced if initialCategories changes (e.g. server revalidated)
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((i) => i.id === active.id);
      const newIndex = categories.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(categories, oldIndex, newIndex);
      
      setCategories(newItems);

      // Optimistic UI + Server update
      startTransition(() => {
        updateCategoriesOrder(newItems.map((c) => c.id));
      });
    }
  };

  return (
    <div
      className="table-responsive"
      style={{
        background: "white",
        borderRadius: "var(--border-radius-sm)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {isPending && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "var(--color-primary)",
            animation: "pulse 1.5s infinite",
            zIndex: 10,
          }}
        />
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "700px" }}>
        <thead>
          <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee" }}>
            <th
              style={{
                padding: "1rem 1.5rem",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#888",
              }}
            >
              Category
            </th>
            <th
              style={{
                padding: "1rem 1.5rem",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#888",
              }}
            >
              Slug
            </th>
            <th
              style={{
                padding: "1rem 1.5rem",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#888",
              }}
            >
              Products
            </th>
            <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>
              Status
            </th>
            <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>
              Home Featured
            </th>
            <th
              style={{
                padding: "1rem 1.5rem",
                fontSize: "0.8rem",
                textTransform: "uppercase",
                color: "#888",
                textAlign: "right",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {categories.map((cat) => (
                <SortableCategoryRow key={cat.id} category={cat} isDragDisabled={!isSortable} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  );
}
