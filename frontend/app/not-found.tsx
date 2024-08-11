export default async function NotFound() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <h2>404, Not found!</h2>
      <a href='/'>Go home?</a>
    </div>
  );
}
