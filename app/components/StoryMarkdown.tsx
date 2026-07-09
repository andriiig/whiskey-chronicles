import ReactMarkdown from "react-markdown";
import Image from "next/image";

/**
 * Markdown wraps a standalone `![]()` line in a <p>, and HTML forbids
 * block elements like <figure>/<div> inside <p>. Using <span className="block">
 * instead of <figure>/<div> keeps the image+caption valid nested in that <p>.
 */
function ImageWithCaption({ src, alt }: { src?: string; alt?: string }) {
  return (
    <span className="my-8 block">
      <span className="relative block h-72 w-full overflow-hidden rounded-lg bg-neutral-800 sm:h-96">
        <Image
          src={src ?? ""}
          alt={alt ?? ""}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </span>
      {alt && (
        <span className="mt-2 block text-center text-sm text-neutral-400">
          {alt}
        </span>
      )}
    </span>
  );
}

export default function StoryMarkdown({ body }: { body: string }) {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-img:rounded-lg">
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => (
            <ImageWithCaption src={typeof src === "string" ? src : undefined} alt={alt} />
          ),
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
