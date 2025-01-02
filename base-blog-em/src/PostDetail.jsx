import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id), // 함수를 반환하도록 수정
    staleTime: 2000,
  });

  if (isLoading) {
    return <h3>Loading comments...</h3>;
  }

  if (isError) {
    return (
      <>
        <h3>Error fetching comments</h3>
        <p>{error.toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && <p className='loading'>Deleting...</p>}
        {deleteMutation.isError && (
          <p className='error'>{deleteMutation.error.toString()}</p>
        )}
        {deleteMutation.isSuccess && (
          <p className='success'>Post deleted successfully</p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>
          Update title
        </button>
        {updateMutation.isPending && <p className='loading'>Updating...</p>}
        {updateMutation.isError && (
          <p className='error'>{updateMutation.error.toString()}</p>
        )}
        {updateMutation.isSuccess && (
          <p className='success'>Post updated successfully</p>
        )}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
