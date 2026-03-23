using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using AdminWPF.Models;
using AdminWPF.Services;
using NUnit.Framework;
using RichardSzalay.MockHttp;

namespace AdminWPF.Tests.Services;

[TestFixture]
public class AsztalServiceTests
{
    private static HttpClient CreateClient(MockHttpMessageHandler mock)
    {
        var client = mock.ToHttpClient();
        client.BaseAddress = new Uri("http://localhost");
        return client;
    }

    [Test]
    public async Task GetAsztalokAsync_SikeresValasz_VisszaadjaAzAsztalokat()
    {
        var asztalok = new List<Asztal>
        {
            new() { Id = 1, HelyekSzama = 4 },
            new() { Id = 2, HelyekSzama = 6 }
        };
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/asztalok").Respond(HttpStatusCode.OK, JsonContent.Create(asztalok));
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.GetAsztalokAsync();

        Assert.That(eredmeny, Has.Count.EqualTo(2));
        Assert.That(eredmeny[0].Id, Is.EqualTo(1));
        Assert.That(eredmeny[0].HelyekSzama, Is.EqualTo(4));
        Assert.That(eredmeny[1].Id, Is.EqualTo(2));
    }

    [Test]
    public async Task GetAsztalokAsync_UresValasz_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/asztalok").Respond(HttpStatusCode.OK, JsonContent.Create(new List<Asztal>()));
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.GetAsztalokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetAsztalokAsync_HalozatiHiba_VisszaadUresLista()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/asztalok").Throw(new HttpRequestException("Hálózati hiba"));
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.GetAsztalokAsync();

        Assert.That(eredmeny, Is.Empty);
    }

    [Test]
    public async Task GetAsztalokAsync_500StatusKod_NemDobKivetelt()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When("http://localhost/api/asztalok").Respond(HttpStatusCode.InternalServerError);
        var service = new AsztalService(CreateClient(mockHttp));

        Assert.DoesNotThrowAsync(async () => await service.GetAsztalokAsync());
    }

    [Test]
    public async Task CreateAsztalAsync_SikeresLetrehozas_IgazatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/asztalok").Respond(HttpStatusCode.Created);
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.CreateAsztalAsync(new AsztalLetrehozas { HelyekSzama = 4 });

        Assert.That(eredmeny, Is.True);
    }

    [Test]
    public async Task CreateAsztalAsync_BadRequest_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/asztalok").Respond(HttpStatusCode.BadRequest);
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.CreateAsztalAsync(new AsztalLetrehozas { HelyekSzama = 0 });

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public async Task CreateAsztalAsync_HalozatiHiba_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Post, "http://localhost/api/asztalok").Throw(new HttpRequestException("Kapcsolat megtagadva"));
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.CreateAsztalAsync(new AsztalLetrehozas { HelyekSzama = 2 });

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public async Task DeleteAsztalAsync_LetezoAsztal_IgazatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/asztalok/5").Respond(HttpStatusCode.OK);
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.DeleteAsztalAsync(5);

        Assert.That(eredmeny, Is.True);
    }

    [Test]
    public async Task DeleteAsztalAsync_NemLetezoAsztal_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/asztalok/999").Respond(HttpStatusCode.NotFound);
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.DeleteAsztalAsync(999);

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public async Task DeleteAsztalAsync_HalozatiHiba_HamisatAd()
    {
        var mockHttp = new MockHttpMessageHandler();
        mockHttp.When(HttpMethod.Delete, "http://localhost/api/asztalok/3").Throw(new HttpRequestException("Időtúllépés"));
        var service = new AsztalService(CreateClient(mockHttp));

        var eredmeny = await service.DeleteAsztalAsync(3);

        Assert.That(eredmeny, Is.False);
    }

    [Test]
    public void Asztal_ToString_HelyCimkeHelyes()
    {
        var asztal = new Asztal { Id = 7, HelyekSzama = 8 };
        Assert.That(asztal.ToString(), Is.EqualTo("Asztal #7 (8 fő)"));
    }
}
