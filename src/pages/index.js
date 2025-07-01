import DeliveryForm from "../components/delivery-form"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Serviço de Entrega da Kiki</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <DeliveryForm />
          </div>
        </div>
      </div>
    </main>
  );
}