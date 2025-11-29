"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { registerUser } from "@/app/actions/register"
import { Loader2, UserPlus, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const KVKK_TEXT = `
KİŞİSEL VERİLERİN KORUNMASI POLİTİKASI
Kurum, olarak bu politika ile tüm taraflardan toplanan, işlenen, depolanan ve arşivlenen kişisel verilerin, 6698 Sayılı Kişisel Verilerin Korunması Kanunu’na (“KVKK”) uygun olarak aşağıdaki sekiz adet ilke ile korunmasını üst yönetim olarak taahhüt etmekteyiz;
Kişisel Veriler;
* Hukuka ve dürüstlük kurallarına uygun olarak toplanmakta, işlenmekte, depolanmakta ve arşivlenmektedir.
* Belirli, meşru ve açık amaçlar için işlenmektedir.
* İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü olarak işlenmektedir.
* Doğruluğu ve güncelliği konusunda azami gayret gösterilmektedir; bu doğrultuda toplanırken doğru veriler toplanmakta ve verilerin güncelliğinin devamlılığı sağlanmaktadır.
* İlgili mevzuatta öngörülen veya işlendikleri amaç için gerekli olan süre kadar muhafaza edilmektedir.
* İşlenirken veri sahiplerinin hak ve talepleri dikkate alınmaktadır. Veri sahibinin hakları kanunda öngörülen şekliyle;
    * Kişisel verisinin işlenip işlenmediğini öğrenme.
    * Kişisel verileri işlenmişse buna ilişkin bilgi talep etme.
    * Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme.
    * Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri öğrenmeyi talep etme.
    * Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme.
    * KVKK veya bu politika uyarınca işlenmesi için hukuka uygun bir gerekçe veya dayanak bulunmayan kişisel verilerin silinmesini veya yok edilmesini isteme.
    * İsteği üzerine yapılan düzeltme veya silme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme.
    * İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme.
    * Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması halinde zararın giderilmesini talep etme.
* İşlenirken teknik ve idari anlamda veri güvenliğine ilişkin gerekli tedbirler alınmaktadır (Gerekli fiziksel, çevresel ve sistemsel tedbirlerin alınması).
* Veri paylaşılırken kanuni istisnalara uygun olarak veya açık rıza alınarak paylaşılır.
kişisel verileriniz yukarıdaki sekiz adet ilkeye uygun olarak şirketlerimiz tarafından toplanır, işlenir, depolanır ve arşivlenir.

WEB SİTESİ AYDINLATMA METNİ
Kurum olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu’nda tanımlı veri sorumlusu sıfatıyla işlediğimiz kişisel verilerinizin güvenliğine önem veriyoruz. Bu nedenle sizleri kişisel verilerinizin işlenmesine ilişkin olarak bilgilendirmek isteriz.
 
KİŞİSEL VERİLERİNİZİN İŞLENME AMACI VE HUKUKİ SEBEBİ
Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanunu ve ikincil düzenlemelere uygun olarak aşağıda belirtilen amaçlar ve hukuki sebepler çerçevesinde işlenecektir: Bu kapsamda web sitemizde temin edilen “Öğrenci-Veli Kimlik Bilgisi, İşlem Bilgisi, Kredi Kartı Bilgileri, Okul Bilgileri-sınıf bilgileri, İletişim Bilgileri, Deneme Sınav Sonuçları, Bu sonuçların analiz raporları, Deneme Sınavları süresi içerisinde çekilen genel sınıf fotoğrafları, öğrencinin dönem sonunda kayıt yapma hakkı doğan okul bilgilerinin kaydedilmesi  ” kategorilerine giren kişisel verileriniz, tarafınıza sunulan hizmetin geliştirilmesi, güvenliğini sağlanması, hileli ya da izinsiz kullanımların tespit edilmesi, operasyonel değerlendirmelerin araştırılması, internet sitesi hizmetlerine ilişkin hataların giderilmesi, gerektiğinde tarafınızla iletişim kurulması, internet kullanım faaliyetlerinizin kolaylaştırılması, pazarlama, satış, reklam, denetim ve kontrol, risk yönetimi, satış sonrası süreçlerin geliştirilmesi, iş geliştirme, tahsilat, satış sonrası hizmetler, hizmet kalitesinin ölçülmesi, geliştirilmesi, iletişim, şikayet yönetimi süreçlerini yürütmek ve de yasal yükümlülüklerin yerine getirilmesi, iş ortakları ile süreçlerin yönetilmesi amacı ile hakkın tesisi ve korunması hukuki sebeplerine dayalı uyarınca işlenecektir.
 
KİŞİSEL VERİLERİN AKTARILMASI
Bu kurum , kişisel verilerinizi mesafeli satış sözleşmesinde belirtilen yükümlülüklerin yerine getirilmesi, tarafınıza sunulan hizmetin geliştirilmesi, güvenliğini sağlanması, hileli ya da izinsiz kullanımların tespit edilmesi, operasyonel değerlendirmelerin araştırılması, İnternet Sitesi hizmetlerine ilişkin hataların giderilmesi, tarafınızla iletişim kurulması, internet kullanım faaliyetlerinizin kolaylaştırılması ve çerez politikamızda belirttiğimiz diğer amaçlar” ve bu amaçlardan herhangi birisinin gerçekleştirilebilmesi için dış kaynak hizmet sağlayıcıları, barındırma hizmet sağlayıcıları (hosting servisleri), hukuk büroları, gibi üçüncü kişiler ile verilerin temin edilme amaçlarına uygun olarak, sınavların gerçekleştirildiği kurum veyahut diğer iş ortakları ile paylaşılması gereken üçüncü kişi iş ortaklarıyla Kanunun 8. maddesine uygun olarak paylaşılabilir.
 
KİŞİSEL VERİLERİN TOPLANMA YÖNTEMLERİ
Bu kurum, kişisel verilerinizi; web sitemize giriş yapmanız veya iletişime geçmek amacıyla iletişim formunu, ön kayıt formu gibi web sayfası üzerinden dolduracağınız  ilgili kısımlar veyahut diğer sosyal medya sayfaları üzerinden göndereceğiniz bilgiler dahilinde toplamaktadır. Bunun yanı sıra başka yöntemlerle kurum ile iletişime geçerek açıkladığınız durumlarda da kişisel verileriniz toplanmaktadır.
 
KİŞİSEL VERİLERİN SAKLANMASI
Kişisel verileriniz 6698 sayılı Kişisel Verilerin Korunması Kanun’unun 5. Maddesi kapsamında yukarıda hukuki sebebi belirtilen kanuni istisnalar kapsamında işlenecek ve muhafaza edilecektir. Bu kapsamda kişisel verileri, yukarıda belirtilen işleme amaçlarının gerektirdiği süre boyunca saklayacaktır. Buna ek olarak AdaSınav, İlgili Kişiler ile arasında doğabilecek herhangi bir uyuşmazlık durumunda, uyuşmazlık kapsamında gerekli savunmaların gerçekleştirilebilmesi amacıyla sınırlı olmak üzere ve mevzuat uyarınca belirlenen zamanaşımı süreleri boyunca kişisel verileri saklayabilecektir.
 
KİŞİSEL VERİLERİN YAYINLANMASI
Deneme sınav süreçlerinde birebir özel olmamakla birlikte genel sınıf ortamında çekilen fotoğraflar kurumun internet sitesi ortamında yayınlanacaktır.
Aynı şekilde Resmi Sınav sonuçlarının açıklanmasının ardından kurumun internet sitesinde sistemin faydalarının göstermek ve reklam yapmak amacı ile öğrencinin isim soy isim ve kayıt yaptırma hakkını kazanmış olduğu okul bilgileri de ayrıca yayınlanacaktır.
Veli tarafından ilgili bilgilerin kaldırılması talep etme hakkı mevcuttur. Velinin fotoğraf ve diğer bilgilerinin internet ortamından kaldırılmasını talep etmesi halinde en kısa sürede ve de en geç 30 gün içerisinde  AdaSınav tarafından gerekli işlemler yapılacaktır.
 
KİŞİSEL VERİLERİNİZE İLİŞKİN HAKLARINIZ
Veri sahibi olarak AdaSınav’a başvurarak;
· Kişisel verilerinizin işlenip işlenmediğini öğrenme,
· Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,
· Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,
· Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,
· Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemlerin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme,
· İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerinizin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemlerin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme,
· İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,
· Kanunun 7. maddesinde yer alan şartlar çerçevesinde kişisel verilerin silinmesini ya da yok edilmesini isteme, yapılan düzeltme, silme ya da yok etme işlemlerinin kişisel verilerin paylaşıldığı üçüncü kişilere bildirilmesini talep etme,
· Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.
Yukarıda sayılan haklarınıza ilişkin taleplerinizi Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ’de öngörülen başvuru usullerine uygun olarak AdaSınav’a iletmeniz durumunda AdaSınav talebinizi niteliğine göre en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandıracaktır.
`

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<"STUDENT" | "TEACHER" | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.set("role", selectedRole)

        try {
            const result = await registerUser(formData)

            if (result.success) {
                setSuccess(result.message)
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            } else {
                setError(result.message)
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
            <Card className="w-full max-w-6xl">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Üye Ol</CardTitle>
                    <CardDescription className="text-center">
                        Sınav Merkezi'ne hoş geldiniz
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="bg-green-50 text-green-900 border-green-200">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        {/* Role Selection */}
                        <div className="flex justify-center mb-6">
                            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("STUDENT")}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedRole === "STUDENT"
                                        ? "border-blue-600 bg-blue-50 text-blue-900"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="font-semibold">Öğrenci</div>
                                    <div className="text-xs text-gray-500">Sınav sonuçlarını görüntüle</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedRole("TEACHER")}
                                    className={`p-4 rounded-lg border-2 transition-all ${selectedRole === "TEACHER"
                                        ? "border-blue-600 bg-blue-50 text-blue-900"
                                        : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                >
                                    <div className="font-semibold">Öğretmen</div>
                                    <div className="text-xs text-gray-500">Öğrencileri takip et</div>
                                </button>
                            </div>
                        </div>

                        {!selectedRole ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>Lütfen kayıt olmak istediğiniz üyelik tipini seçiniz.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid md:grid-cols-3 gap-8">
                                    {/* Column 1: User Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-600 border-b pb-2">
                                            {selectedRole === "TEACHER" ? "Öğretmen Bilgileri" : "Öğrenci Bilgileri"}
                                        </h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="name">Ad <span className="text-red-500">*</span></Label>
                                            <Input id="name" name="name" required disabled={loading} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="surname">Soyad <span className="text-red-500">*</span></Label>
                                            <Input id="surname" name="surname" required disabled={loading} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="username">Kullanıcı Adı <span className="text-red-500">*</span></Label>
                                            <Input id="username" name="username" required disabled={loading} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Şifre <span className="text-red-500">*</span></Label>
                                            <Input id="password" name="password" type="password" required disabled={loading} />
                                        </div>

                                        {selectedRole === "STUDENT" && (
                                            <div className="space-y-2">
                                                <Label htmlFor="classLevel">Sınıf <span className="text-red-500">*</span></Label>
                                                <Select name="classLevel" required>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seçiniz..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[5, 6, 7, 8, 9, 10, 11, 12, "Mezun"].map((level) => (
                                                            <SelectItem key={level} value={level.toString()}>
                                                                {level}. Sınıf
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="school">Okul <span className="text-red-500">*</span></Label>
                                            <Input id="school" name="school" required disabled={loading} />
                                        </div>

                                        {selectedRole === "STUDENT" && (
                                            <>
                                            </>
                                        )}

                                        {selectedRole === "TEACHER" && (
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Cep Telefonu <span className="text-red-500">*</span></Label>
                                                <Input id="phone" name="phone" placeholder="0 (5__) ___ __ __" required disabled={loading} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Column 2: Parent Info (Only for Students) or Empty for Teacher */}
                                    <div className="space-y-4">
                                        {selectedRole === "STUDENT" ? (
                                            <>
                                                <h3 className="text-lg font-semibold text-purple-600 border-b pb-2">Veli Bilgileri</h3>

                                                <div className="space-y-2">
                                                    <Label htmlFor="parentName">Veli Adı <span className="text-red-500">*</span></Label>
                                                    <Input id="parentName" name="parentName" required disabled={loading} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="parentSurname">Veli Soyadı <span className="text-red-500">*</span></Label>
                                                    <Input id="parentSurname" name="parentSurname" required disabled={loading} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="city">İkamet İl <span className="text-red-500">*</span></Label>
                                                    <Input id="city" name="city" required disabled={loading} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="district">İkamet İlçe <span className="text-red-500">*</span></Label>
                                                    <Input id="district" name="district" required disabled={loading} />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Veli Telefon Numarası <span className="text-red-500">*</span></Label>
                                                    <Input id="phone" name="phone" placeholder="0 (5__) ___ __ __" required disabled={loading} />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="hidden md:block"></div> // Spacer for teacher layout
                                        )}
                                    </div>

                                    {/* Column 3: General Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-pink-600 border-b pb-2">Genel Bilgiler</h3>

                                        <div className="space-y-2">
                                            <Label htmlFor="referenceSource">Bizi nereden duydunuz?</Label>
                                            <Select name="referenceSource">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seçiniz..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="sosyal_medya">Sosyal Medya</SelectItem>
                                                    <SelectItem value="arkadas">Arkadaş Tavsiyesi</SelectItem>
                                                    <SelectItem value="reklam">Reklam</SelectItem>
                                                    <SelectItem value="diger">Diğer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="pt-4">
                                            <div className="flex items-start space-x-2">
                                                <Checkbox id="kvkkConsent" name="kvkkConsent" required />
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="kvkkConsent"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <span className="text-blue-600 hover:underline cursor-pointer">
                                                                    KVKK Aydınlatma Metnini
                                                                </span>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                                                <DialogHeader>
                                                                    <DialogTitle>KVKK Aydınlatma Metni</DialogTitle>
                                                                    <DialogDescription>
                                                                        Lütfen aşağıdaki metni dikkatlice okuyunuz.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="whitespace-pre-wrap text-sm">
                                                                    {KVKK_TEXT}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        {" "}okudum onaylıyorum. <span className="text-red-500">*</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-6" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Üye Ol
                                </Button>
                            </>
                        )}

                        <div className="text-center text-sm text-gray-600">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline font-medium">
                                Giriş Yap
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
