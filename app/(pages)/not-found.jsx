import Link from 'next/link'
// import "@/globals.css";
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { Home } from 'lucide-react'

export default async function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center text-error">
                        404
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                    <p className="text-base-content/70 mb-6">
                        Oops! It seems the page you're looking for doesn't exist or has been moved.
                    </p>
                    <Link href="/">
                        <Button
                            className="btn btn-primary gap-2"
                            size="lg"
                        >
                            <Home className="w-5 h-5" />
                            Back to PCMC PedBC Portal
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}