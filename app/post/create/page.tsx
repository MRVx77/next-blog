import PostForm from "@/components/post/post-from";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CreatePostPage() {
  return (
    <main>
      <div className="max-w-4xl mx-auto p-4d">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default CreatePostPage;
