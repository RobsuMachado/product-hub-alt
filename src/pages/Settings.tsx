
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Download, Upload, Trash2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();

  const handleLogout = () => {
    window.location.reload();
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado do sistema.',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Dados exportados',
      description: 'Os dados foram exportados com sucesso.',
    });
  };

  const handleImportData = () => {
    toast({
      title: 'Dados importados',
      description: 'Os dados foram importados com sucesso.',
    });
  };

  const handleClearData = () => {
    toast({
      title: 'Dados limpos',
      description: 'Todos os dados foram removidos.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa</Label>
              <Input id="company" defaultValue="ProductHub" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda Padrão</Label>
              <Input id="currency" defaultValue="BRL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStock">Limite de Estoque Baixo</Label>
              <Input id="lowStock" type="number" defaultValue="5" />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas de estoque baixo
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Backup Automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Backup diário dos dados
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Alternar entre temas claro e escuro
                  </p>
                </div>
                <Switch />
              </div>
            </div>

            <Button className="w-full">Salvar Configurações</Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Exportar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Baixe todos os seus dados em formato JSON
              </p>
              <Button onClick={handleExportData} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Importar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Importe dados de um backup anterior
              </p>
              <Button onClick={handleImportData} variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Limpar Dados</Label>
              <p className="text-sm text-muted-foreground">
                Remove todos os produtos e categorias
              </p>
              <Button
                onClick={handleClearData}
                variant="destructive"
                className="w-full"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos os Dados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <Label>Versão</Label>
              <p className="text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <Label>Última Atualização</Label>
              <p className="text-muted-foreground">27 de Maio, 2025</p>
            </div>
            <div>
              <Label>Suporte</Label>
              <p className="text-muted-foreground">support@producthub.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
