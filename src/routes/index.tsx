import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const data = [
    {
      path: '/docxtemplater',
      name: 'docxtemplater',
    },
  ];

  return (
    <div className="p-4 flex gap-4">
      {
        data.map((item) => {
          return (
            <Button key={item.path} asChild>
              <Link to={item.path}>{item.name}</Link>
            </Button>
          );
        })
      }
    </div>
  );
}
