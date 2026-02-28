"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createPost(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session?.user) {
      return {
        success: false,
        message: "You must be logIn to create a Post",
      };
    }

    //get form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    // homework implement a extra vaildiation layer
    if (!title || !description || !content) {
      return {
        success: false,
        message: "plese enter the text in each box",
      };
    }

    // create slug post titls
    const slug = slugify(title);
    // check if slug already exists
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });

    if (existingPost) {
      return {
        success: false,
        message: "A post with same title already exists",
      };
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        description,
        content,
        slug,
        authorId: session.user.id,
      })
      .returning();

    //revalidate page to home page and refresh
    revalidatePath("/");
    revalidatePath("/post/${slug}");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Post created successfully",
      slug,
    };
  } catch (error) {
    return {
      success: false,
      message: "Faild to create post",
    };
  }
}

export async function updatePost(postId: number, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "You must logged in to edit the post!",
      };
    }
    //get form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;

    // homework implement a extra vaildiation layer
    if (!title || !description || !content) {
      return {
        success: false,
        message: "plese enter the text in each box",
      };
    }

    const slug = slugify(title);
    const existingPost = await db.query.posts.findFirst({
      where: and(eq(posts.slug, slug), ne(posts.id, postId)),
    });

    if (existingPost) {
      return {
        success: false,
        message: "A post with this title already exists",
      };
    }
  } catch (error) {}
}
